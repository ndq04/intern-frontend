import axios from "axios";
export const DEFAULT_OPTS = {
  Pragma: 'no-cache',
  'Content-Type': 'application/json; charset=utf-8',
  'Authorization': 'Bearer ndq'
};

export function POST(url, data) {
  return axios({
    method: 'POST',
    headers: { ...DEFAULT_OPTS },
    url,
    data
  });
}

export function GET(url, params) {
  return axios({
    method: 'GET',
    headers: { ...DEFAULT_OPTS },
    url,
    params
  });
}