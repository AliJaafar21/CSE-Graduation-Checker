export function getAccessCsrf() {
  var AccessCsrf = localStorage.getItem("AccessCsrf")
  return AccessCsrf ? AccessCsrf : ''
}

export function saveAccessCsrf(AccessCsrf) {
  AccessCsrf ? localStorage.setItem("AccessCsrf", AccessCsrf) : localStorage.removeItem("AccessCsrf")
}

