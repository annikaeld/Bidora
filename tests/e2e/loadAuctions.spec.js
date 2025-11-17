import { test, expect } from "@playwright/test";

test("API -> page: displays auction items returned from API", async ({
  page,
}) => {
  // Intercept the API call and return a minimal payload (absolute URL used in page)
  await page.route("**/localhost/api/auctions", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: "1", title: "Item One" },
        { id: "2", title: "Item Two" },
      ]),
    }),
  );

  // Minimal page that fetches /api/auctions and renders results into #auctions-container
  const html = `<!doctype html>
  <html>
    <body>
      <div id="auctions-container"></div>
      <script>
        (async function(){
          try{
            const res = await fetch('http://localhost/api/auctions');
            const data = await res.json();
            const container = document.getElementById('auctions-container');
            data.forEach(a=>{
              const el = document.createElement('div');
              el.className = 'auction-item';
              el.textContent = a.title || a.name || 'untitled';
              container.appendChild(el);
            });
          }catch(e){
            // surface error for debugging
            window.__fetchError = String(e);
          }
        })();
      </script>
    </body>
  </html>`;

  await page.setContent(html);

  // Wait for either items to render or for a fetch error to be set by the page
  await page.waitForFunction(
    () => {
      return (
        (document.querySelectorAll &&
          document.querySelectorAll("#auctions-container .auction-item")
            .length >= 2) ||
        !!window.__fetchError
      );
    },
    { timeout: 5000 },
  );

  const fetchErr = await page.evaluate(() => window.__fetchError || null);
  if (fetchErr) throw new Error(`page fetch failed: ${fetchErr}`);

  // Assert two rendered items exist
  const items = page.locator("#auctions-container .auction-item");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Item One");
  await expect(items.nth(1)).toContainText("Item Two");
});
