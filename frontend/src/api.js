import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Auto attach admin token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers['X-Admin-Token'] = token
  return config
})

// Locations
export const fetchLocations  = ()          => API.get('/locations')
export const searchLocations = (q)         => API.get(`/locations?q=${q}`)
export const fetchLocation   = (id)        => API.get(`/locations/${id}`)

// Admin auth
export const adminLogin = async (password) => {
  const res = await API.post('/admin/login', { password })
  if (res.data.success) {
    localStorage.setItem('adminToken', res.data.token)
  }
  return res
}

export const adminLogout = () => {
  localStorage.removeItem('adminToken')
  return API.post('/admin/logout')
}

export const adminCheck = () => API.get('/admin/check')

// Admin CRUD
export const adminAddLocation    = (data)     => API.post('/locations', data)
export const adminUpdateLocation = (id, data) => API.put(`/locations/${id}`, data)
export const adminDeleteLocation = (id)       => API.delete(`/locations/${id}`)


export const fetchDeletedLocations  = ()     => API.get('/admin/deleted')
export const restoreLocation        = (id)   => API.post(`/admin/restore/${id}`)
export const permanentDeleteLocation = (id)  => API.delete(`/admin/permanent-delete/${id}`)