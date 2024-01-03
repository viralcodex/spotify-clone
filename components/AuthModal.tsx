"use client";

import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";
import {toast} from "react-hot-toast";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  
  const {isOpen, onClose} = useAuthModal();

  useEffect(()=>{
    if(session){
        router.refresh();
        onClose();
        toast.success(`Welcome Back!`)
    }
  },[session, router, onClose]);

  const onChange = (open:boolean)=>{
    if(!open) onClose();
  }
  return (
    <Modal title="Welcome Back" description="Login to your Account" isOpen = {isOpen} onChange={onChange}>
      <Auth theme="dark" magicLink providers={['github']} supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa, variables:{
        default: {colors: {brand:'#404040', brandAccent: '#22c55e'}}
      } }} />
    </Modal>
  );
};

export default AuthModal;
