import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Spinner() {
  return (
    <span role="status" className="inline-flex items-center">
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-pale-purple animate-spin text-xl"
      />
      <span className="sr-only">Loading</span>
    </span>
  );
}
