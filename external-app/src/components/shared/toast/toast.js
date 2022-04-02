import React from "react"
import Toast from 'react-bootstrap/Toast';
import "./toast.scss";

const ToastNotification = (props) => {
    // console.log(props.notification[0].Sender.name, "+++++++++++++++++")
    // console.log(props.show, "+++++++++++++++++")
    return (
        <div className="header-toast">
            <Toast onClose={(e) => { props.onClose() }} show={true} delay={3000} autohide>
                <Toast.Header>
                    
                </Toast.Header>
            </Toast>
        </div>
    )
};
export default ToastNotification