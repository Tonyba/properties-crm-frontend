import axios from "axios";
import { API_URL } from "../helpers/constants";
import type { GenericResponse, Task, WithDataId } from "../helpers/types";


export const create_task = (task: Task) => axios.post<GenericResponse & WithDataId>(`${API_URL}?action=create_task`, new URLSearchParams({ fields: JSON.stringify(task) }));

