import { USE_MOCK, http } from './http'
import { db, delay } from './mock/db'

export async function listAccounts() {
  if (USE_MOCK) {
    await delay()
    return db.accounts.map((a) => ({ ...a }))
  }
  const { data } = await http.get('/accounts')
  return data
}

export async function saveAccount(account) {
  if (USE_MOCK) {
    await delay()
    if (account.id) {
      const existing = db.accounts.find((a) => a.id === account.id)
      if (existing) {
        Object.assign(existing, account)
        return { ...existing }
      }
    }
    const created = { ...account, id: `u-${Date.now()}`, lastLogin: null }
    db.accounts.push(created)
    return { ...created }
  }
  const { data } = account.id ? await http.put(`/accounts/${account.id}`, account) : await http.post('/accounts', account)
  return data
}

export async function setAccountActive(id, active) {
  if (USE_MOCK) {
    await delay()
    const a = db.accounts.find((x) => x.id === id)
    if (a) a.active = active
    return { ...a }
  }
  const { data } = await http.patch(`/accounts/${id}`, { active })
  return data
}

export async function resetPassword(id) {
  if (USE_MOCK) {
    await delay()
    return { ok: true }
  }
  const { data } = await http.post(`/accounts/${id}/reset-password`)
  return data
}
