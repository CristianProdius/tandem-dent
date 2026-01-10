"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { resendAdminInvite, deleteAdminInvite } from "@/lib/actions/auth.actions";

interface AdminActionsProps {
  adminId: string;
  isPending: boolean;
  currentUserName: string;
}

export function AdminActions({ adminId, isPending, currentUserName }: AdminActionsProps) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleResendInvite = async () => {
    setIsResending(true);
    try {
      const result = await resendAdminInvite(adminId, currentUserName);
      if (result.success) {
        toast.success("Invitație retrimisă", {
          description: "Un nou email de invitație a fost trimis.",
        });
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut retrimite invitația.",
        });
      }
    } catch (error) {
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleDeleteInvite = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAdminInvite(adminId);
      if (result.success) {
        toast.success("Invitație anulată", {
          description: "Invitația a fost ștearsă cu succes.",
        });
        router.refresh();
      } else {
        toast.error("Eroare", {
          description: result.error || "Nu s-a putut șterge invitația.",
        });
      }
    } catch (error) {
      toast.error("Eroare", {
        description: "A apărut o eroare. Vă rugăm încercați din nou.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (!isPending) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Acțiuni</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleResendInvite}
            disabled={isResending}
          >
            {isResending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Retrimite invitația
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Anulează invitația
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anulează invitația?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va șterge invitația. Persoana invitată nu va mai
              putea să își creeze contul folosind link-ul primit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Înapoi</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvite}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se șterge...
                </>
              ) : (
                "Anulează invitația"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
