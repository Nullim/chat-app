import { ResetPassProps } from "../../../pages/home/Home"
import { useAppSelector } from "../../../redux/hooks"
import { SUCCESS_MESSAGE } from "../../../utils/constants"
import "../Form.css"
import PassReset from "./Forms/PassReset"
import PassResetRequest from "./Forms/PassResetRequest"
import PassResetVerification from "./Forms/PassResetVerification"

const ResetPass: React.FC<ResetPassProps> = ({ setReset }) => {
  const recoveryStatus = useAppSelector(state => state.auth.recoveryStatus)
  const recoveryVerificationStatus = useAppSelector(state => state.auth.recoveryVerificationStatus)
  const resetPassStatus = useAppSelector(state => state.auth.resetPassStatus)
  return (
    <div className="form-container">
      <h3>Recover Password</h3>
      {recoveryStatus != SUCCESS_MESSAGE &&
        <PassResetRequest setReset={setReset} />}
      {recoveryStatus === SUCCESS_MESSAGE &&
        recoveryVerificationStatus != SUCCESS_MESSAGE &&
        <PassResetVerification />}
      {recoveryVerificationStatus === SUCCESS_MESSAGE && 
        resetPassStatus != SUCCESS_MESSAGE &&
        <PassReset setReset={setReset} />
      }
    </div>
  )
}

export default ResetPass