import { ArrowRightLeft, DollarSign } from "lucide-react";

import { Link } from "react-router-dom";
import SingleAccount from "./SingleAccount";
import useStore from "../store/useStore";

const AccountSummary = () => {
  const { accounts } = useStore();
  const totalBalance = useStore((state) => state.getTotalBalance());
  return (
    <section className="">
      <h1 className="text-3xl font-bold text-center mb-4 text-orange-800">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {accounts?.map((account) => (
          <SingleAccount key={account.id} account={account} />
        ))}
      </div>
      <div className="flex items-center justify-center mb-6">
        <Link
          to="/transfer"
          className="underline animate-bounce text-orange-600 flex items-center gap-2"
        >
          Move Money <ArrowRightLeft />
        </Link>
      </div>
    </section>
  );
};

export default AccountSummary;
