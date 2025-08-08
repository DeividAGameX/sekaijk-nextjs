import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import NotificationsModalForm from "./ModalForm";

function CreateNotifications() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div
                className="text-xl hover:text-primary transition duration-150"
                onClick={() => setOpen(true)}
            >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </div>
            <NotificationsModalForm
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}

export default CreateNotifications;
