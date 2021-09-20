import express from 'express';
// middleware
import {checkAccessControl} from "../middlewares/access-control";
// controllers
import ticketController from "../../controllers/ticket";

const router = express.Router();

// routes
router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicket);
router.get('/', ticketController.userTicketList);
router.post('/:id/conversation', ticketController.addConversation);
router.put('/:id/procedure/sent', ticketController.setTicketStatusToSent);
router.put('/:id/procedure/investigating', checkAccessControl('admin__set_ticket_status_to_investigating'),ticketController.setTicketStatusToInvestigating);
router.put('/:id/procedure/replayed', checkAccessControl('admin__set_ticket_status_to_replayed'), ticketController.setTicketStatusToReplayed);
router.put('/:id/procedure/change', checkAccessControl('admin__update_ticket_procedure'), ticketController.updateTicketProcedure);
router.put('/:id/reference-ticket', checkAccessControl('admin__reference_ticket'),ticketController.referenceTicket);
router.put('/:id/status/close', checkAccessControl('admin__close_ticket'), ticketController.closeTicket);
router.put('/:id/delete', checkAccessControl('admin__delete_ticket'), ticketController.deleteTicket);
router.put('/:id', ticketController.editTicket);
router.get('/:id/conversation-list', ticketController.ticketConverSationList )
router.get('/admin-tickets', checkAccessControl('admin__get_tickets'),ticketController.getAdminTickets);
router.get('/super-admin-tickets', checkAccessControl('superadmin__get_tickets'), ticketController.getTicketsForSuperAdmin);
router.get('/user-tickets', checkAccessControl('suerpadmin__get_user_tickets'), ticketController.getUserTicketsForAdmin);
router.put('/:id/admin-edit', checkAccessControl('admin__edit_ticket'), ticketController.editTicketByAdmin);
router.put('/:id/admin-delete', checkAccessControl('admin__delete_ticket'),ticketController.deleteTickedByAdmin);

export default router;