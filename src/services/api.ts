import axios from "axios";

export const partnersApi = axios.create({
  baseURL: "https://644060ba792fe886a88de1b9.mockapi.io/v1/test/partners",
});

export const externalCompaniesApi = axios.create({
  baseURL: "https://655cf25525b76d9884fe3153.mockapi.io/v1/external-companies",
});
