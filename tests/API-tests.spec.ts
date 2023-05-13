import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let number: number;
let sysID: string;
const shortDescription = "Add more memory to server";
const category = "hardware";

test("Create an Incident, receive correct status and correct response data", async ({
  request,
  baseURL,
}) => {
  const expectedStatusCode = 201;

  const response = await request.post(`${baseURL}`, {
    data: {
      short_description: shortDescription,
      category: category,
    },
  });

  const jsonData = await response.json();

  expect(response.status()).toBe(expectedStatusCode);
  expect(response.ok()).toBeTruthy();

  expect(jsonData).toHaveProperty("result");
  expect(jsonData.result.short_description).toEqual(shortDescription);
  expect(jsonData.result.category).toEqual(category);

  number = jsonData.result.task_effective_number;
  sysID = jsonData.result.sys_id;
});

test("Get an Incident and receive correct status and response data", async ({
  request,
  baseURL,
}) => {
  const expectedStatusCode = 200;
  const response = await request.get(`${baseURL}`, {
    params: {
      task_effective_number: number,
      sysparm_fields: "short_description, category",
    },
  });

  const jsonData = await response.json();

  expect(response.status()).toBe(expectedStatusCode);
  expect(jsonData).toMatchObject({
    result: [
      {
        short_description: shortDescription,
        category: category,
      },
    ],
  });
});

test("Update an Incident and receive correct status", async ({
  request,
  baseURL,
}) => {
  const expectedStatusCode = 200;
  const updatedDescription = "Reinstall Linux Server";
  const updatedCategory = "Software";

  const response = await request.put(`${baseURL}/${sysID}`, {
    data: {
      short_description: updatedDescription,
      category: updatedCategory,
    },
  });

  expect(response.status()).toBe(expectedStatusCode);
  expect(response.ok()).toBeTruthy();
});

test("Delete an Incident and receive correct status", async ({
  request,
  baseURL,
}) => {
  const expectedStatusCode = 204;
  const response = await request.delete(`${baseURL}/${sysID}`, {});

  expect(response.status()).toBe(expectedStatusCode);
  expect(response.ok()).toBeTruthy();
});
