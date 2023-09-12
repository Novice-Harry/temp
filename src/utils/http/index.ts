import { NewAxios } from './NewAxios'
import { timeout, baseURL } from './config'
export const myAxios = new NewAxios({ timeout, baseURL })
