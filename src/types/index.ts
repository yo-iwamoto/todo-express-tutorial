export interface Payload {
  id: number;
}

export interface UserRecord {
  id: number;
  uid: string;
  created_at: object;
  updated_at: object;
}

export interface TaskRecord {
  id: number;
  name: string;
  status: number;
}
