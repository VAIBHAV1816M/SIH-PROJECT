export interface User {
  id: string
  name: string
  email: string
  password: string
  department: string
  role: "Manager" | "Employee"
  contactNumber?: string
  birthdate?: string
  address?: string
}

export const hardcodedUsers: User[] = [
  {
    id: "1",
    name: "John Manager",
    email: "john@company.com",
    password: "manager123",
    department: "Public Works Department (PWD)",
    role: "Manager",
    contactNumber: "+91 9876543210",
    birthdate: "1985-05-15",
    address: "Pune, Maharashtra",
  },
  {
    id: "2",
    name: "Sarah Admin",
    email: "sarah@company.com",
    password: "admin123",
    department: "Solid Waste Management Department",
    role: "Manager",
    contactNumber: "+91 9876543211",
    birthdate: "1987-08-22",
    address: "Mumbai, Maharashtra",
  },
  {
    id: "3",
    name: "Mike Employee",
    email: "mike@company.com",
    password: "emp123",
    department: "Municipal Corporation Electrical Department",
    role: "Employee",
    contactNumber: "+91 9876543212",
    birthdate: "1992-03-10",
    address: "Pune, Maharashtra",
  },
  {
    id: "4",
    name: "Lisa Worker",
    email: "lisa@company.com",
    password: "emp123",
    department: "Health & Sanitation Department",
    role: "Employee",
    contactNumber: "+91 9876543213",
    birthdate: "1990-12-05",
    address: "Pune, Maharashtra",
  },
  {
    id: "5",
    name: "David Tech",
    email: "david@company.com",
    password: "emp123",
    department: "Water Works Department",
    role: "Employee",
    contactNumber: "+91 9876543214",
    birthdate: "1993-07-18",
    address: "Pune, Maharashtra",
  },
  {
    id: "6",
    name: "Anna Support",
    email: "anna@company.com",
    password: "emp123",
    department: "Solid Waste Management Department",
    role: "Employee",
    contactNumber: "+91 9876543215",
    birthdate: "1991-11-30",
    address: "Pune, Maharashtra",
  },
  {
    id: "7",
    name: "Tom Developer",
    email: "tom@company.com",
    password: "emp123",
    department: "Public Works Department (PWD)",
    role: "Employee",
    contactNumber: "+91 9876543216",
    birthdate: "1994-02-14",
    address: "Pune, Maharashtra",
  },
]

export const departments = [
  "Solid Waste Management Department",
  "Health & Sanitation Department",
  "Water Works Department",
  "Public Works Department (PWD)",
  "Municipal Corporation Electrical Department",
]

export function authenticateUser(email: string, password: string, department: string, role: string): User | null {
  const user = hardcodedUsers.find(
    (u) => u.email === email && u.password === password && u.department === department && u.role === role,
  )
  return user || null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}
