import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";

export default function DeleteBtn({ resource, id, onDeleteCallback }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    let token = localStorage.getItem('token');

    const onDelete = async () => {
        if (!token) {
            alert("Not authenticated. Please log in.");
            setIsDeleting(false);
            return;
        }

        const options = {
            method: "DELETE",
            url: `/${resource}/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
      };

      try {
        setLoading(true);
        const response = await axios.request(options);
        console.log("Delete success:", response.data);
        if (onDeleteCallback) {
            onDeleteCallback(id);
        }
        setIsDeleting(false);
      } catch (err) {
        console.error("Delete error:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
          if (err.response.status === 409) {
            const msg = err.response.data?.message || "Conflict: resource cannot be deleted.";
            alert(msg);
          } else {
            const msg = err.response.data?.message || `Delete failed: ${err.response.status}`;
            alert(msg);
          }
        } else {
          alert("Network error or no response from server.");
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    (!isDeleting) ?(
        <Button 
            className="cursor-pointer text-red-500 hover:border-red-700 hover:text-red-700"
            variant="outline"
            size="icon"
            onClick={() => setIsDeleting(true)}
        ><Trash /></Button>
    ) : (
        <>
            <p>Are you sure?</p>
            <Button 
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="cursor-pointer text-red-500 border-red-500 hover:text-red-700 hover:border-red-700"
                disabled={loading}
            >
              {loading ? "Deleting..." : "Yes"}
            </Button>
            <Button 
                onClick={() => setIsDeleting(false)}
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-500 border-slate-500 hover:text-slate-700 hover:border-slate-700"
                disabled={loading}
            >No</Button>
        </>
    )
   
  );
}