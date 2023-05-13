import { expect } from "@playwright/test";

export class IncidentPage {
  sysID: string;
  number: number;

  constructor(private request: any, private baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async createIncident(shortDescription: string, category: string) {
    const response = await this.request.post(this.baseURL, {
      data: {
        short_description: shortDescription,
        category: category,
      },
    });

    const jsonData = await response.json();

    this.number = jsonData.result.task_effective_number;
    this.sysID = jsonData.result.sys_id;

    return { response, jsonData };
  }

  async getIncident() {
    const response = await this.request.get(this.baseURL, {
      params: {
        task_effective_number: this.number,
        sysparm_fields: "short_description, category",
      },
    });

    const jsonData = await response.json();

    return { response, jsonData };
  }

  async updateIncident(updatedDescription: string, updatedCategory: string) {
    const response = await this.request.put(`${this.baseURL}/${this.sysID}`, {
      data: {
        short_description: updatedDescription,
        category: updatedCategory,
      },
    });

    const jsonData = await response.json();

    return { response, jsonData };
  }

  async deleteIncident() {
    const response = await this.request.delete(
      `${this.baseURL}/${this.sysID}`,
      {}
    );

    return response;
  }

  verifyCreateIncidentResponse(
    response: any,
    jsonData: any,
    shortDescription: string,
    category: string,
    expectedStatusCode: number
  ) {
    expect(response.status()).toBe(expectedStatusCode);
    expect(response.ok()).toBeTruthy();

    expect(jsonData).toHaveProperty("result");
    expect(jsonData.result.short_description).toEqual(shortDescription);
    expect(jsonData.result.category).toEqual(category);
  }

  verifyGetIncidentResponse(
    response: any,
    jsonData: any,
    shortDescription: string,
    category: string,
    expectedStatusCode: number
  ) {
    expect(response.status()).toBe(expectedStatusCode);
    expect(jsonData).toMatchObject({
      result: [
        {
          short_description: shortDescription,
          category: category,
        },
      ],
    });
  }

  verifyUpdateIncidentResponse(response: any, expectedStatusCode: number) {
    expect(response.status()).toBe(expectedStatusCode);
    expect(response.ok()).toBeTruthy();
  }

  verifyDeleteIncidentResponse(response: any, expectedStatusCode: number) {
    expect(response.status()).toBe(expectedStatusCode);
    expect(response.ok()).toBeTruthy();
  }
}
