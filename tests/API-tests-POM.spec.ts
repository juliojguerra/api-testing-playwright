import { test, expect } from "@playwright/test";
import { IncidentPage } from "../pageobjects/IncidentPage";

let incidentPage: IncidentPage;
const shortDescription = "Add more memory to server";
const category = "hardware";

test.beforeAll(async ({ request, baseURL }) => {
  incidentPage = new IncidentPage(request, `${baseURL}`);
});

test("Create an Incident, receive correct status and correct response data", async () => {
  const expectedStatusCode = 201;

  const { response, jsonData } = await incidentPage.createIncident(
    shortDescription,
    category
  );

  incidentPage.verifyCreateIncidentResponse(
    response,
    jsonData,
    shortDescription,
    category,
    expectedStatusCode
  );
});

test("Get an Incident and receive correct status and response data", async () => {
  const expectedStatusCode = 200;

  const { response, jsonData } = await incidentPage.getIncident();

  incidentPage.verifyGetIncidentResponse(
    response,
    jsonData,
    shortDescription,
    category,
    expectedStatusCode
  );
});

test("Update an Incident and receive correct status", async () => {
  const expectedStatusCode = 200;
  const updatedDescription = "Reinstall Linux Server";
  const updatedCategory = "Software";

  const { response } = await incidentPage.updateIncident(
    updatedDescription,
    updatedCategory
  );

  incidentPage.verifyUpdateIncidentResponse(response, expectedStatusCode);
});

test("Delete an Incident and receive correct status", async () => {
  const expectedStatusCode = 204;

  const response = await incidentPage.deleteIncident();

  incidentPage.verifyDeleteIncidentResponse(response, expectedStatusCode);
});
