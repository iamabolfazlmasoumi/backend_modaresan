import Permission from "../src/models/permission";
import Department from "../src/models/department";

export const permissionSeeder = async () => {
    try {
        const permissions = [
            {
                title: 'teacher__create_booklet_material',
                description: 'teacher__create_booklet_material',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_materials_of_booklet',
                description: 'teacher__get_materials_of_booklet',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_branch',
                description: 'admin__create_branch',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_sub_branch',
                description: 'admin__create_sub_branch',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_group',
                description: 'admin__create_group',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_sub_group',
                description: 'admin__create_sub_group',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_department',
                description: 'admin__create_department',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_hr_list',
                description: 'admin__get_hr_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'create_permission',
                description: 'create_permission',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_users_of_department',
                description: 'admin__get_users_of_department',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_department_tickets',
                description: 'admin__get_department_tickets',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__send_exam_basic_request',
                description: 'teacher__send_exam_basic_request',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_exam_basic_request_list_By_exam_id',
                description: 'admin__get_exam_basic_request_list_By_exam_id',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__handle_exam_basic_field',
                description: 'admin__handle_exam_basic_field',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_exam_basic_filed_history',
                description: 'admin__get_exam_basic_filed_history',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_exam_basic_request',
                description: 'admin__get_exam_basic_request',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__handle_exam_basic_state',
                description: 'admin__handle_exam_basic_state',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__clone_exam_basic',
                description: 'admin__clone_exam_basic',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__set_exam_factor_paid',
                description: 'teacher__set_exam_factor_paid',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__send_exam_basic_production_request',
                description: 'teacher__send_exam_basic_production_request',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__send_exam_publish',
                description: 'teacher__send_exam_publish',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_exam',
                description: 'teacher__create_exam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam',
                description: 'teacher__get_exam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_exam_basic',
                description: 'admin__create_exam_basic',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_booklet',
                description: 'teacher__create_booklet',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam_booklet',
                description: 'teacher__get_exam_booklet',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher_get_booklet_material',
                description: 'teacher_get_booklet_material',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_exam_production',
                description: 'teacher__create_exam_production',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam_production',
                description: 'teacher__get_exam_production',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_exam_publish',
                description: 'create_permission',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam_publish',
                description: 'teacher__get_exam_publish',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_exam_factor',
                description: 'teacher__create_exam_factor',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam_factor',
                description: 'teacher__get_exam_factor',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__complete_exam_production',
                description: 'teacher__complete_exam_production',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam_detail',
                description: 'teacher__get_exam_detail',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_exam',
                description: 'teacher__get_exam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_fiscal_year',
                description: 'admin__create_fiscal_year',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_exam_material_questions',
                description: 'teacher__create_exam_material_questions',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_bank_for_material_question',
                description: 'teacher__get_bank_for_material_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__select_random_question',
                description: 'teacher__select_random_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__define_new_question',
                description: 'teacher__define_new_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_material_question',
                description: 'teacher__get_material_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_booklet_material',
                description: 'teacher__get_booklet_material',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_option',
                description: 'teacher__get_option',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_option_list',
                description: 'teacher__get_option_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_permission',
                description: 'admin__create_permission',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_permission_list',
                description: 'admin__get_permission_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_permission',
                description: 'admin__get_permission',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__edit_permission',
                description: 'admin__edit_permission',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_question',
                description: 'teacher__create_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_question_bank',
                description: 'teacher__get_question_bank',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_question_bank',
                description: 'teacher__create_question_bank',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_question_bank',
                description: 'teacher__get_question_bank',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_answer',
                description: 'teacher__get_answer',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_answer',
                description: 'teacher__create_answer',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_answer',
                description: 'teacher__get_answer',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_question',
                description: 'teacher__create_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_option',
                description: 'teacher__get_option',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_textbook',
                description: 'teacher__create_textbook',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_textbook',
                description: 'teacher__get_textbook',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__add_question_to_bank',
                description: 'teacher__add_question_to_bank',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__add_option_to_question',
                description: 'teacher__add_option_to_question',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_country',
                description: 'admin__create_country',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_province',
                description: 'admin__create_province',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__create_city',
                description: 'admin__create_city',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__handle_setting',
                description: 'admin__handle_setting',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_setting',
                description: 'admin__get_setting',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_sponser',
                description: 'teacher__create_sponser',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__handle_acceptrance_request',
                description: 'admin__handle_acceptrance_request',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_question_bank',
                description: 'teacher__create_question_bank',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_lesson',
                description: 'teacher__create_lesson',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_lesson_list',
                description: 'teacher__get_lesson_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_lesson',
                description: 'teacher__get_lesson',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_season_for_lesson',
                description: 'teacher__create_season_for_lesson',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_season',
                description: 'teacher__get_season',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__create_topic_for_season',
                description: 'teacher__create_topic_for_season',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_topic',
                description: 'teacher__get_topic',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_topic_list',
                description: 'teacher__get_topic_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'teacher__get_season_list',
                description: 'teacher__get_season_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__set_ticket_status_to_investigating',
                description: 'admin__set_ticket_status_to_investigating',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__set_ticket_status_to_replayed',
                description: 'admin__set_ticket_status_to_replayed',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__update_ticket_procedure',
                description: 'admin__update_ticket_procedure',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__reference_ticket',
                description: 'admin__reference_ticket',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__close_ticket',
                description: 'admin__close_ticket',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__delete_ticket',
                description: 'admin__delete_ticket',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'superadmin__get_tickets',
                description: 'superadmin__get_tickets',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'suerpadmin__get_user_tickets',
                description: 'suerpadmin__get_user_tickets',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__edit_ticket',
                description: 'admin__edit_ticket',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__delete_ticket',
                description: 'admin__delete_ticket',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_user_list',
                description: 'admin__get_user_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__assign_role_to_user',
                description: 'admin__assign_role_to_user',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_user_exams',
                description: 'admin__get_user_exams',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_booklets_materials_of_exam_for_admin',
                description: 'admin__get_booklets_materials_of_exam_for_admin',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_exam_basic_request_by_id_for_admin',
                description: 'admin__get_exam_basic_request_by_id_for_admin',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_booklets_of_exam_for_admin',
                description: 'admin__get_booklets_of_exam_for_admin',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_exam_by_id_for_admin',
                description: 'admin__get_exam_by_id_for_admin',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_role_list',
                description: 'admin__get_role_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
            {
                title: 'admin__get_role',
                description: 'admin__get_role',
                isDeleted: false,   
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin__edit_role',
                description: 'admin__edit_role',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin__create_role',
                description: 'admin__create_role',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin__create_role',
                description: 'admin__create_role',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin__get_exam_production_reqeust_by_id',
                description: 'admin__get_exam_production_reqeust_by_id',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin_get_exam_production_requests',
                description: 'admin_get_exam_production_requests',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
             {
                title: 'admin__get_exam_publish_requests',
                description: 'admin__get_exam_publish_requests',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
              {
                title: 'admin__get_exam_publish_request_by_id',
                description: 'admin__get_exam_publish_request_by_id',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
               {
                title: 'admin__get_exam_publish_requests',
                description: 'admin__get_exam_publish_requests',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'admin__get_exam_factors_list',
                description: 'admin__get_exam_factors_list',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__edit_exam',
                description: 'teacher__edit_exam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'edmin__edit_exam',
                description: 'edmin__edit_exam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__deleteExam',
                description: 'teacher__deleteExam',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__delete_exam_basic',
                description: 'teacher__delete_exam_basic',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__delete_exam_production',
                description: 'teacher__delete_exam_production',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__delete_exam_publish',
                description: 'teacher__delete_exam_publish',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__delete_exam_factor',
                description: 'teacher__delete_exam_factor',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__delete_exam_publish',
                description: 'teacher__delete_exam_publish',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__change_exam_production_state',
                description: 'teacher__change_exam_production_state',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
                {
                title: 'teacher__change_exam_publish_state',
                description: 'teacher__change_exam_publish_state',
                isDeleted: false,
                createdAt: Date.now(),
                updatedAt: null
            },
        ];

        for (let permission of permissions) {
            let newPermission = await new Permission(permission);
            await newPermission.save();
        }
        let newDepartment = await new Department({
            title: "Admin",
            code: "0001",
            capacity: 1,
            createdAt: Date.now(),
            updatedAt: null,
            isDeleted: false,
        });
        await newDepartment.save();
        console.log("[seed]: Department seeded.");
    } catch (err) {
        console.log("Error --> " , err)
        throw new Error("failed to seed database");
    }
}