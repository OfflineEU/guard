export interface Environment {
  apiKey: string,
  production: boolean,
  fbDBUrl: string,

}

export interface FbAuthResponse {
  idToken: string,
  expiresIn: string,

}

export interface Cameras {
  'camera-one': boolean,
  'camera-two': boolean,
  'camera-three': boolean,
  'camera-four': boolean,
}

export interface Staff {
  'personal number': any,
  employee: string,
  arrival: any,
  leaving: any,
  demand: any,
}

export interface Fire {
  'sensor-1': boolean,
  'sensor-2': boolean,
  'sensor-3': boolean,
}

export interface Report {
  id?: string,
  camera: number,
  date: string,
  time: string,
  text: string,
  reportTime?: string,
}

export interface FbCreateResponse {
  name: string,
}
