import { ResetPassProps } from "../../../pages/home/Home"
import { useAppSelector } from "../../../redux/hooks"
import { SUCCESS_MESSAGE } from "../../../utils/constants"
import "../Form.css"
import PassReset from "./Forms/PassReset"
import PassResetRequest from "./Forms/PassResetRequest"
import PassResetVerification from "./Forms/PassResetVerification"

const ResetPass: React.FC<ResetPassProps> = ({ setReset }) => {
  const auth = useAppSelector(state => state.auth)
  return (
    <div className="form-container">
      <h3>Recover Password</h3>
      {auth.recoveryStatus != SUCCESS_MESSAGE &&
        <PassResetRequest setReset={setReset} />}
      {auth.recoveryStatus === SUCCESS_MESSAGE &&
        auth.recoveryVerificationStatus != SUCCESS_MESSAGE &&
        <PassResetVerification />}
      {auth.recoveryVerificationStatus === SUCCESS_MESSAGE && 
        auth.recoveryStatus != 'Idle' &&
        auth.resetPassStatus != SUCCESS_MESSAGE &&
        <PassReset setReset={setReset} />
      }
    </div>
  )
}

export default ResetPass