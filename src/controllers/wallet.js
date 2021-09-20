//utils

//error handling
import OperationalError, {NOT_FOUND_ERROR} from '../api/validations/operational-error';
import ProgrammingError from '../api/validations/programmer-error';
//models
import Wallet from "../models/wallet";

//debug
const debug = require("debug")("app:dev");

const walletController = {
    deposit: async function (req, res, next) {
        try {
            const {
                amount
            } = req.body;

            let deposit = await new Wallet({
                walletType: "deposit",
                amount: amount,
                description: "deposit",
                user: req.user.id,
            });
            await deposit.save();
            return res.status(200).json(deposit);

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    withdraw: async function (req, res, next) {
        try {
            const {
                amount,
                order
            } = req.body;

            let order = await Order.findOne({
                order: order,
                isDeleted: false
            });

            if (!order) return next(new OperationalError(NOT_FOUND_ERROR, "order"));
            let userWalletBalance = this.userWalletBalance.userWalletBalance;
            if (amount > userWalletBalance) return next(new OperationalError(INVALID_OPERATION_ERROR, "withdraw"));

            let withdraw = await new Wallet({
                walletType: "withdraw",
                amount: amount,
                description: "withdraw due to orderCode: " + order.code,
                order: order._id,
                user: req.user.id,
            });
            await withdraw.save();
            return res.status(200).json(withdraw);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userWalletBalance: async function (req, res, next) {
        try {
            let reducer = (accumulator, currentValue) => accumulator + currentValue;
            let deposit = await Wallet.find({
                user: req.params.id,
                isDeleted: false,
                isCompleted: true,
            }).reduce(reducer, 0);

            let withdraw = await Wallet.find({
                user: req.params.id,
                isDeleted: false,
                isCompleted: true,
            }).reduce(reducer, 0);

            let userWalletBalance = deposit - withdraw;
            return res.status(200).json({"userWalletBalance": userWalletBalance});
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userWalletList: async function (req, res, next) {
        try {
            let wallets = await Wallet.find({user: req.params.id, isDeleted: false});
            return res.status(200).json(wallets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    addWallet: async function (req, res, next) {
        try {
            const { amount } = req.body;
            let newWallet = await new Wallet({
                walleteType: "deposit",
                amount: amount,
                code: "code",
                description: "deposit",
                user: req.user.id,
            });
            await newWallet.save();
            return res.status(200).json(newWallet);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    chargeWallet: async function (req, res, next) {
        try {
            let wallet = await Wallet.findOne({ _id: req.params.id, isDeleted: false, isCompleted: false, walletType: "deposit" });
            if (!wallet) return next(new OperationalError(NOT_FOUND_ERROR, "wallet")); 
            let updatedWallet = await Wallet.updateOne({ _id: req.params.id, isDeleted: false, isCompleted: false, walletType: "deposit" }, {
                isCompleted: true,
                completedAt: Date.now(),
            });
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    }


}

export default walletController;