import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const useLogout = () => {
  const router = useRouter()
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
        onError: () => {
          toast.error("Failed to sign out. Please try again.")
        }
      },
    });
  }


  return { signOut }
}


export default useLogout
