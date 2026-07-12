import axios from 'axios'
import { getToken } from '../lib/storage'

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

client.interceptors.request.use(async (config) => {
  const token = await getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client
