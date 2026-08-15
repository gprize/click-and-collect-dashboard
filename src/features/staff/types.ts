export type RoleStaff = 'ADMIN_MAGASIN' | 'EMPLOYE'

export interface Staff {
  id: string
  email: string
  role: RoleStaff
}