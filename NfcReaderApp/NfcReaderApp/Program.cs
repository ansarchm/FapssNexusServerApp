using PCSC;
using PCSC.Iso7816;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // URL of your .NET Core backend API endpoint
        string backendUrl = "https://localhost:5001/api/card/read";

        using var http = new HttpClient();
        var contextFactory = ContextFactory.Instance;
        using var context = contextFactory.Establish(SCardScope.System);

        // Get list of connected readers
        var readers = context.GetReaders();
        if (readers == null || readers.Length == 0)
        {
            Console.WriteLine("❌ No NFC readers found.");
            return;
        }

        string readerName = readers[0];
        Console.WriteLine($"✅ Using reader: {readerName}");
        Console.WriteLine("Tap your MIFARE card...");

        while (true)
        {
            try
            {
                // Connect to card (wait for insertion)
                using var reader = new IsoReader(
                    context,
                    readerName,
                    SCardShareMode.Shared,
                    SCardProtocol.Any,
                    false);

                // Send APDU to get UID
                var apdu = new CommandApdu(IsoCase.Case2Short, reader.ActiveProtocol)
                {
                    CLA = 0xFF,
                    INS = 0xCA,
                    P1 = 0x00,
                    P2 = 0x00,
                    Le = 0
                };

                var response = reader.Transmit(apdu);

                if (response.SW1 == 0x90 && response.SW2 == 0x00)
                {
                    var uidBytes = response.GetData();
                    var uidHex = BitConverter.ToString(uidBytes).Replace("-", "");
                    Console.WriteLine($"🎯 Card UID: {uidHex}");

                    // POST to backend
                    var json = JsonSerializer.Serialize(new { Uid = uidHex });
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    try
                    {
                        var resp = await http.PostAsync(backendUrl, content);
                        Console.WriteLine($"📡 Sent to backend: {resp.StatusCode}");
                        Console.WriteLine(await resp.Content.ReadAsStringAsync());
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("⚠️ Error sending to backend: " + ex.Message);
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Failed to get UID. SW1={response.SW1:X2}, SW2={response.SW2:X2}");
                }

                reader.Disconnect(SCardReaderDisposition.Leave);
            }
            catch (Exception ex)
            {
                Console.WriteLine("⏳ Waiting for card...");
                await Task.Delay(1000);
            }

            await Task.Delay(500);
        }
    }
}
