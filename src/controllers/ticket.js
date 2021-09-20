import {
    NOT_AUTHORIZED_ERROR,
    NOT_FOUND_ERROR
} from "../api/validations/operational-error";
import Ticket from "../models/ticket";
import TicketConversation from "../models/ticket-conversations";
const ticketController = {
    createTicket: async function (req, res, next) {
        try {
            const {
                title,
                department
            } = req.body;
            let newTicket = await new Ticket({
                user: req.user.id,
                title: title,
                department: department,
                status: "open",
                procedure: "sent"
            });
            await newTicket.save();
            return res.status(200).json(newTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    addConversation: async function (req, res, next) {
        try {
            const {
                body,
                file
            } = req.body;
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let newConversation = await new TicketConversation({
                user: req.user.id,
                body: body,
                ticket: req.params.id,
                file: file
            });
            await newConversation.save(newConversation);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    setTicketStatusToSent: async function (req, res, next) {
      try {
           let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
          if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
          let updatedTicket = await Ticket.updateOne({ _id: req.params.id, isDeleted: false }, {
              procedure: "sent"
          });
          return res.status(200).json(updatedTicket);
      } catch (error) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
    setTicketStatusToInvestigating: async function (req, res, next) {
        try {
           let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
          if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
          let updatedTicket = await Ticket.updateOne({ _id: req.params.id, isDeleted: false }, {
              procedure: "investigating"
          });
          return res.status(200).json(updatedTicket);
      } catch (error) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
    setTicketStatusToReplayed: async function (req, res, next) {
      try {
          let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
          if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
          let updatedTicket = await Ticket.updateOne({ _id: req.params.id, isDeleted: false }, {
              procedure: "replayed"
          });
          return res.status(200).json(updatedTicket);
      } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
      }  
    },
    getTicket: async function (req, res, next) {
        try {
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                user: req.user.id,
                isDeleted: false
            }).populate("user");
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            return res.status(200).json(ticket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    referenceTicket: async function (req, res, next) {
        try {
            const {
                department
            } = req.body;
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let updatedTicket = await Ticket.updateOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                referenceDepartment: department,
                procedure: "sent",
                updatedAt: Date.now(),
            });
            return res.status(200).json(updatedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    closeTicket: async function (req, res, next) {
        try {
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let updatedTicket = await Ticket.updateOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                status: "close",
                updatedAt: Date.now(),
            });
            return res.status(200).json(updatedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    updateTicketProcedure: async function (req, res, next) {
        try {
            const {
                procedure
            } = req.body;
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            let updatedTicket = await Ticket.updateOne({
                _id: req.params.id,
                isDeleted: false
            }, {
                procedure: procedure,
                updatedAt: Date.now(),
            });
            return res.status(200).json(updatedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteTicket: async function (req, res, next) {
        try {
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let deletedTicket = await ticket.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                isDeleted: false,
                updateAt: Date.now()
            });
            let conversations = await TicketConversation.find({
                ticket: req.params.id,
                isDeleted: false
            });
            for (conversation of conversations) {
                TicketConversation.updateOne({
                    _id: conversation._id,
                    isDeleted:false
                }, {
                    isDeleted: false,
                    updatedAt: Date.now()
                });
            }
            return res.status(200).json(deletedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editTicket: async function (req, res, next) {
        try {
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            if (ticket.procedure === "investigating" || ticket.procedure === "replayed") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let updatedTicket = await ticket.updateOne({
                _id: req.params.id,
                isDeleted: false,
                user: req.user.id
            }, {
                title: title,
                updateAt: Date.now()
            });
            return res.status(200).json(updatedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    userTicketList: async function (req, res, next) {
        try {
            let tickets = await Ticket.find({
                isDeleted: false,
                user: req.user.id
            })
            return res.status(200).json(tickets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    ticketConverSationList: async function (req, res, next) {
        try {
            let conversations = await TicketConversation.find({
                ticket: req.params.id,
                isDeleted: false
            });
            return res.status(200).json(conversations);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getDepartmentTickets: async function (req, res, next) {
        try {
            let tickets = await Ticket.find({
                isDeleted: false,
                department: req.params.id
            });
            return res.status(200).json(tickets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getAdminTickets: async function (req, res, next) {
        try {
            let user = await User.findOne({
                _id: req.user.id,
                isDeleted: false
            });
            if (!user) return next(new OperationalError(NOT_FOUND_ERROR, 'user'));
            let department = user.department;
            if(!department) return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'department'));
            let tickets = await Ticket.find({
                isDeleted: false,
                department: department,
            });
            return res.status(200).json(tickets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getTicketsForSuperAdmin: async function (req, res, next) {
        try {
            let tickets = await Ticket.find({
                isDeleted: false
            });
            return res.status(200).json(tickets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    getUserTicketsForAdmin: async function (req, res, next) {
        try {
            //check if user is Admin? // check if user has access to this category? 
            let tickets = await Ticket.find({
                _id: user,
                isDeleted: false
            });
            return res.status(200).json(tickets);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    editTicketByAdmin: async function (req, res, next) {
        try {
            const { status, procedure } = req.body;
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (status === "open") {
                let updatedTicket = await ticket.updateOne({
                    _id: req.params.id,
                    isDeleted: false,
                }, {
                    status: "open",
                    procedure: procedure,
                    title: title,
                    updateAt: Date.now()
                });
                return res.status(200).json(updatedTicket);
            } else {
                return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'status'));
            }

        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },
    deleteTickedByAdmin: async function (req, res, next) {
       try {
            let ticket = await Ticket.findOne({
                _id: req.params.id,
                isDeleted: false
            });
            if (!ticket) return next(new OperationalError(NOT_FOUND_ERROR, 'ticket'));
            if (ticket.status === "close") return next(new OperationalError(NOT_AUTHORIZED_ERROR, 'ticketStatus'));
            let deletedTicket = await ticket.updateOne({
                _id: req.params.id,
                isDeleted: false,
            }, {
                isDeleted: false,
                updateAt: Date.now()
            });
            let conversations = await TicketConversation.find({
                ticket: req.params.id,
                isDeleted: false
            });
            for (conversation of conversations) {
                TicketConversation.updateOne({
                    _id: conversation._id,
                    isDeleted:false
                }, {
                    isDeleted: false,
                    updatedAt: Date.now()
                });
            }
            return res.status(200).json(deletedTicket);
        } catch (err) {
            return next(new ProgrammingError(err.message, err.stack));
        }
    },

}
export default ticketController;