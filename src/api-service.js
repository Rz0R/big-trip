const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get points() {
    return this.#load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(`${this.#endPoint}/${url}`, { method, body, headers });

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}

export default ApiService;
