import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DocumentsPage() {
  return (
    <ProtectedRoute requiredPermissions={['view_public_documents']}>
      <div>Hello world</div>
    </ProtectedRoute>
  )
}
