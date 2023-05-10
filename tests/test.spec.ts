import { expect, test } from "@playwright/test";

const shortDescription = "Add more memory to server";
const category = "hardware";

test("Create an Incident", async ({ request, baseURL }) => {
  const expectedStatusCode = 201;

  const response = await request.post(`${baseURL}`, {
    data: {
      short_description: shortDescription,
      category: category,
    },
  });

  expect(response.status()).toBe(expectedStatusCode);
  expect(response.ok()).toBeTruthy();
});
