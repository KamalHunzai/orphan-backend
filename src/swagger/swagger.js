"use strict";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Orphan Care API",
    version: "1.0.0",
    description:
      "REST API for the Orphan Care Management System.\n\n" +
      "**Authentication:** All protected endpoints require an `accessToken` header containing the JWT returned at login.\n\n" +
      "**Roles:**\n" +
      "- `superadmin` — platform owner; manages admins, views global dashboards\n" +
      "- `admin` — social worker / mentor; manages children, tasks, journals, reports, activities, visit plans\n" +
      "- `child` — can log in, view their own data, receive notifications\n\n" +
      "Public endpoints (login, signup, OTP flows) require no token.",
  },
  servers: [
    {
      url: "http://localhost:{port}",
      variables: {
        port: { default: "3000" },
      },
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "apiKey",
        in: "header",
        name: "accessToken",
        description: "JWT token returned from login. Pass as header: accessToken: <token>",
      },
    },
    schemas: {
      // ── Shared ──────────────────────────────────────────────────────────
      SuccessMessage: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          error: { type: "string" },
        },
      },
      // ── SuperAdmin ───────────────────────────────────────────────────────
      SuperAdmin: {
        type: "object",
        properties: {
          id: { type: "integer" },
          full_name: { type: "string" },
          email: { type: "string" },
          county: { type: "string" },
          role: { type: "string" },
          number: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Admin ────────────────────────────────────────────────────────────
      Admin: {
        type: "object",
        properties: {
          id: { type: "integer" },
          full_name: { type: "string" },
          email: { type: "string" },
          phone_number: { type: "string" },
          country: { type: "string" },
          employment_type: { type: "string" },
          years_of_experience: { type: "integer" },
          professional_background: { type: "string" },
          maximum_case_load: { type: "integer" },
          preferred_age_group: { type: "string" },
          special_skills: { type: "string" },
          profile_picture: { type: "string" },
          role: { type: "string", example: "admin", description: "Role of the admin — always 'admin'" },
          superadmin_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Child ────────────────────────────────────────────────────────────
      Child: {
        type: "object",
        properties: {
          id: { type: "integer" },
          first_name: { type: "string" },
          last_name: { type: "string" },
          age: { type: "integer" },
          gender: { type: "string" },
          location: { type: "string" },
          language: { type: "string" },
          guardian_name: { type: "string" },
          relationship: { type: "string" },
          contact_number: { type: "string" },
          email: { type: "string" },
          general_condition: { type: "string" },
          current_education_level: { type: "string" },
          school_performance: { type: "string" },
          psychological_support_needs: { type: "string" },
          financial_situation: { type: "string" },
          additional_notes: { type: "string" },
          profile_picture: { type: "string" },
          admin_id: { type: "integer" },
          upload: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Journal ──────────────────────────────────────────────────────────
      Journal: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          journal_text: { type: "string" },
          emotion_tags: { type: "array", items: { type: "string" } },
          social_interaction: { type: "string" },
          assessment_type: { type: "string" },
          notes: { type: "string" },
          uploaded_file: { type: "string" },
          mood_rating: { type: "integer" },
          activities: { type: "array", items: { type: "string" } },
          child_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Comment ──────────────────────────────────────────────────────────
      Comment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          admin_id: { type: "integer" },
          journal_id: { type: "integer" },
          text: { type: "string" },
          visible: { type: "boolean" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Activity ─────────────────────────────────────────────────────────
      Activity: {
        type: "object",
        properties: {
          id: { type: "integer" },
          activity_type: { type: "string" },
          child_id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          date: { type: "string", format: "date-time" },
          time: { type: "string" },
          attachments: { type: "string" },
          admin_id: { type: "integer" },
          status: { type: "string", example: "pending" },
          uploaded_file: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Task ─────────────────────────────────────────────────────────────
      Task: {
        type: "object",
        properties: {
          id: { type: "integer" },
          task_title: { type: "string" },
          description: { type: "string" },
          child_name: { type: "string" },
          child_id: { type: "integer" },
          admin_id: { type: "integer" },
          due_date: { type: "string", format: "date-time" },
          due_time: { type: "string" },
          priority: { type: "string" },
          task_type: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Report ───────────────────────────────────────────────────────────
      Report: {
        type: "object",
        properties: {
          id: { type: "integer" },
          admin_id: { type: "integer" },
          child_id: { type: "integer" },
          report_type: { type: "string" },
          urgency_level: { type: "string" },
          general_condition: { type: "string" },
          recent_doctor_visits: { type: "string" },
          nutrition_status: { type: "string" },
          physical_activities: { type: "string" },
          academic_performance: { type: "string" },
          attendance_participation: { type: "string" },
          mental_state: { type: "string" },
          social_integration: { type: "string" },
          financial_needs: { type: "string" },
          existing_support: { type: "string" },
          notable_events: { type: "string" },
          date: { type: "string", format: "date-time" },
          time: { type: "string" },
          additional_notes: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── LearningMaterial ─────────────────────────────────────────────────
      LearningMaterial: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
          related_tag: { type: "string" },
          due_date: { type: "string", format: "date-time" },
          due_time: { type: "string" },
          priority: { type: "string", example: "normal" },
          task_type: { type: "string" },
          file: { type: "string" },
          file_type: { type: "string" },
          admin_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Notification ─────────────────────────────────────────────────────
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          message: { type: "string" },
          type: { type: "string" },
          child_id: { type: "integer" },
          admin_id: { type: "integer" },
          is_read: { type: "boolean" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── VisitPlanning ────────────────────────────────────────────────────
      VisitPlanning: {
        type: "object",
        properties: {
          id: { type: "integer" },
          child_id: { type: "integer" },
          admin_id: { type: "integer" },
          visit_date: { type: "string", format: "date-time" },
          visit_time: { type: "string" },
          visit_type: { type: "string" },
          notes: { type: "string" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── VisitReport ──────────────────────────────────────────────────────
      VisitReport: {
        type: "object",
        properties: {
          id: { type: "integer" },
          child_id: { type: "integer" },
          donor_id: { type: "integer" },
          visit_date: { type: "string", format: "date-time" },
          visit_time: { type: "string" },
          visit_type: { type: "string" },
          notes: { type: "string" },
          status: { type: "string" },
          admin_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Announcement ─────────────────────────────────────────────────────
      Announcement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          content: { type: "string" },
          priority: { type: "string", example: "normal" },
          superadmin_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      // ── Management ───────────────────────────────────────────────────────
      Management: {
        type: "object",
        properties: {
          id: { type: "integer" },
          full_name: { type: "string" },
          email: { type: "string" },
          phone_number: { type: "string" },
          country: { type: "string" },
          role: { type: "string" },
          superadmin_id: { type: "integer" },
          is_deleted: { type: "boolean" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
  },

  paths: {
    // ══════════════════════════════════════════════════════════════════════
    // SUPERADMIN
    // ══════════════════════════════════════════════════════════════════════
    "/superadmin/create": {
      post: {
        tags: ["SuperAdmin"],
        summary: "Create a new SuperAdmin",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  fullname: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  county: { type: "string" },
                  number: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "SuperAdmin created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuperAdmin" } } } },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/superadmin/signin": {
      post: {
        tags: ["SuperAdmin"],
        summary: "SuperAdmin login — returns JWT with role: superadmin",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful — returns token and superAdmin object" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/superadmin/update/{id}": {
      put: {
        tags: ["SuperAdmin"],
        summary: "Update SuperAdmin [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullname: { type: "string" },
                  email: { type: "string" },
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
          404: { description: "SuperAdmin not found" },
        },
      },
    },
    "/superadmin/getbyid/{id}": {
      get: {
        tags: ["SuperAdmin"],
        summary: "Get SuperAdmin by ID [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "SuperAdmin object", content: { "application/json": { schema: { $ref: "#/components/schemas/SuperAdmin" } } } },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
          404: { description: "Not found" },
        },
      },
    },
    "/superadmin/getDashboardCounts": {
      get: {
        tags: ["SuperAdmin"],
        summary: "Get dashboard counts by country [superadmin]",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Dashboard counts — totalOrphans, pendingReports, upcomingSchedule, urgentCases" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
        },
      },
    },
    "/superadmin/getAdminsAndManagers": {
      get: {
        tags: ["SuperAdmin"],
        summary: "Get all admins and managers [superadmin]",
        responses: {
          200: { description: "List of admins and managers" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
        },
      },
    },
    "/superadmin/delete/{id}": {
      delete: {
        tags: ["SuperAdmin"],
        summary: "Soft-delete a SuperAdmin [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Deleted successfully" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
          404: { description: "Not found" },
        },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // ADMIN
    // ══════════════════════════════════════════════════════════════════════
    "/admin/add": {
      post: {
        tags: ["Admin"],
        summary: "Register a new admin",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["full_name", "email", "password"],
                properties: {
                  full_name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  phone_number: { type: "string" },
                  country: { type: "string" },
                  employment_type: { type: "string" },
                  years_of_experience: { type: "integer" },
                  professional_background: { type: "string" },
                  maximum_case_load: { type: "integer" },
                  preferred_age_group: { type: "string" },
                  special_skills: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Admin registered — returns token and admin object" },
          400: { description: "Validation error" },
        },
      },
    },
    "/admin/signin": {
      post: {
        tags: ["Admin"],
        summary: "Admin login — returns JWT with role: admin",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful — returns token and admin object" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/admin/sendOtp": {
      post: {
        tags: ["Admin"],
        summary: "Send OTP to admin email for password reset",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: { email: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "OTP sent" },
          404: { description: "Admin not found" },
        },
      },
    },
    "/admin/verifyOtp": {
      post: {
        tags: ["Admin"],
        summary: "Verify OTP for admin",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: { type: "string" },
                  otp: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "OTP verified" },
          400: { description: "Invalid or expired OTP" },
        },
      },
    },
    "/admin/resetPassword": {
      post: {
        tags: ["Admin"],
        summary: "Reset admin password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "newPassword"],
                properties: {
                  email: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password updated" },
          404: { description: "Admin not found" },
        },
      },
    },
    "/admin/update/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Update admin with optional profile picture upload [admin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  email: { type: "string" },
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                  phone_number: { type: "string" },
                  country: { type: "string" },
                  professional_background: { type: "string" },
                  profilePicture: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
          401: { description: "No token provided" },
          403: { description: "Admin access required" },
          404: { description: "Admin not found" },
        },
      },
    },
    "/admin/updateAdmin/{id}": {
      put: {
        tags: ["Admin"],
        summary: "Update admin profile without file [admin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  full_name: { type: "string" },
                  email: { type: "string" },
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
          404: { description: "Admin not found" },
        },
      },
    },
    "/admin/getbyid/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get admin by ID [admin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Admin object", content: { "application/json": { schema: { $ref: "#/components/schemas/Admin" } } } },
          401: { description: "No token provided" },
          403: { description: "Admin access required" },
          404: { description: "Not found" },
        },
      },
    },
    "/admin/get-by-id/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get admin with children and reports — SuperAdmin view [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Admin with assigned_children, recent_reports, recent_schedules" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
          404: { description: "Not found" },
        },
      },
    },
    "/admin/getDashboardStats/{adminId}": {
      get: {
        tags: ["Admin"],
        summary: "Get admin dashboard stats [admin]",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "activeChildren, reportsThisMonth, upcomingVisits, learningMaterials" },
          401: { description: "No token provided" },
          403: { description: "Admin access required" },
        },
      },
    },
    "/admin/get-MentorsBy-Country": {
      get: {
        tags: ["Admin"],
        summary: "Get mentors and child counts by country [superadmin]",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "totalMentors, totalChildren, mentors array" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
        },
      },
    },
    "/admin/get-by-country": {
      get: {
        tags: ["Admin"],
        summary: "Get admins filtered by country [superadmin]",
        parameters: [{ name: "country", in: "query", required: false, schema: { type: "string" } }],
        responses: {
          200: { description: "List of admins" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
        },
      },
    },
    "/admin/get-Mentor-Activity-count/{country}": {
      get: {
        tags: ["Admin"],
        summary: "Get monthly activity counts for mentors in a country [superadmin]",
        parameters: [{ name: "country", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Array of { month, activity_count }" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
        },
      },
    },
    "/admin/getAllNotifications": {
      get: {
        tags: ["Admin"],
        summary: "Get all notifications [admin]",
        responses: {
          200: { description: "List of notifications" },
          401: { description: "No token provided" },
          403: { description: "Admin access required" },
        },
      },
    },
    "/admin/deleteAdminById/{id}": {
      delete: {
        tags: ["Admin"],
        summary: "Soft-delete admin by ID [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Deleted successfully" },
          401: { description: "No token provided" },
          403: { description: "SuperAdmin access required" },
          404: { description: "Not found" },
        },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // CHILD
    // ══════════════════════════════════════════════════════════════════════
    "/child/addChild": {
      post: {
        tags: ["Child"],
        summary: "Add a new child (supports file upload) [admin]",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["first_name", "last_name"],
                properties: {
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  email: { type: "string" },
                  age: { type: "integer" },
                  gender: { type: "string" },
                  location: { type: "string" },
                  language: { type: "string" },
                  guardian_name: { type: "string" },
                  relationship: { type: "string" },
                  contact_number: { type: "string" },
                  general_condition: { type: "string" },
                  current_education_level: { type: "string" },
                  school_performance: { type: "string" },
                  psychological_support_needs: { type: "string" },
                  financial_situation: { type: "string" },
                  additional_notes: { type: "string" },
                  admin_id: { type: "integer" },
                  profilePicture: { type: "string", format: "binary" },
                  upload: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Child created", content: { "application/json": { schema: { $ref: "#/components/schemas/Child" } } } },
          400: { description: "Validation error" },
        },
      },
    },
    "/child/login": {
      post: {
        tags: ["Child"],
        summary: "Child login — returns JWT with role: child",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful — returns token and child object" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/child/allchildren": {
      get: {
        tags: ["Child"],
        summary: "Get all children (paginated, filterable) [admin]",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "country", in: "query", schema: { type: "string" } },
          { name: "minAge", in: "query", schema: { type: "integer" } },
          { name: "maxAge", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Paginated children list — page, limit, total, totalPages, children" },
          404: { description: "No children found" },
        },
      },
    },
    "/child/getbyid/{id}": {
      get: {
        tags: ["Child"],
        summary: "Get child by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Child object", content: { "application/json": { schema: { $ref: "#/components/schemas/Child" } } } },
          404: { description: "Not found" },
        },
      },
    },
    "/child/updateChild/{id}": {
      put: {
        tags: ["Child"],
        summary: "Update child (supports file upload)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  first_name: { type: "string" },
                  last_name: { type: "string" },
                  age: { type: "integer" },
                  gender: { type: "string" },
                  location: { type: "string" },
                  profilePicture: { type: "string", format: "binary" },
                  upload: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
          404: { description: "Child not found" },
        },
      },
    },
    "/child/deleteChild/{id}": {
      delete: {
        tags: ["Child"],
        summary: "Soft-delete child by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: { description: "Deleted successfully" },
          404: { description: "Not found" },
        },
      },
    },
    "/child/getAdminByChildId/{childId}": {
      get: {
        tags: ["Child"],
        summary: "Get the assigned admin for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Admin object" }, 404: { description: "Not found" } },
      },
    },
    "/child/getChildrenByAdminId/{adminId}": {
      get: {
        tags: ["Child"],
        summary: "Get all children assigned to an admin",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Children list with count" } },
      },
    },
    "/child/age-distribution": {
      get: {
        tags: ["Child"],
        summary: "Get age distribution statistics by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Array of age groups with counts and percentages" } },
      },
    },
    "/child/countChildrenByCountry": {
      get: {
        tags: ["Child"],
        summary: "Count children in a specific country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "{ country, count }" } },
      },
    },
    "/child/getDashboardCounts": {
      get: {
        tags: ["Child"],
        summary: "Get dashboard counts for a country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "totalChildren, totalReports, upcomingSchedules, urgentCases" } },
      },
    },
    "/child/getChildrenByCountry": {
      get: {
        tags: ["Child"],
        summary: "Get all children in a country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Children list with count" } },
      },
    },
    "/child/get-Age-Group": {
      get: {
        tags: ["Child"],
        summary: "Get age group distribution",
        parameters: [{ name: "country", in: "query", required: false, schema: { type: "string" } }],
        responses: { 200: { description: "totalChildren, data array of age groups" } },
      },
    },
    "/child/sendOtp": {
      post: {
        tags: ["Child"],
        summary: "Send OTP to child email",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string" } } } } },
        },
        responses: { 200: { description: "OTP sent" }, 404: { description: "Child not found" } },
      },
    },
    "/child/verifyOtp": {
      post: {
        tags: ["Child"],
        summary: "Verify OTP for child",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email", "otp"], properties: { email: { type: "string" }, otp: { type: "integer" } } } } },
        },
        responses: { 200: { description: "OTP verified" }, 400: { description: "Invalid or expired OTP" } },
      },
    },
    "/child/updatePassword/{id}": {
      put: {
        tags: ["Child"],
        summary: "Update child password [child]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["oldPassword", "newPassword"], properties: { oldPassword: { type: "string" }, newPassword: { type: "string" } } } } },
        },
        responses: { 200: { description: "Password updated" }, 401: { description: "No token / wrong current password" }, 403: { description: "Child access required" } },
      },
    },
    "/child/resetPassword": {
      post: {
        tags: ["Child"],
        summary: "Reset child password via email",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["email", "newPassword"], properties: { email: { type: "string" }, newPassword: { type: "string" } } } } },
        },
        responses: { 200: { description: "Password reset" }, 404: { description: "Child not found" } },
      },
    },
    "/child/getReportByChildId/{childId}": {
      get: {
        tags: ["Child"],
        summary: "Get reports for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Report list" }, 404: { description: "Not found" } },
      },
    },
    "/child/getNotificationsByChild/{childId}": {
      get: {
        tags: ["Child"],
        summary: "Get notifications for a child [child]",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Notification list" }, 401: { description: "No token provided" }, 403: { description: "Child access required" } },
      },
    },
    "/child/markNotificationAsRead/{id}": {
      put: {
        tags: ["Child"],
        summary: "Mark a notification as read [child]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Marked as read" }, 401: { description: "No token provided" }, 403: { description: "Child access required" }, 404: { description: "Notification not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // JOURNAL
    // ══════════════════════════════════════════════════════════════════════
    "/journal/create": {
      post: {
        tags: ["Journal"],
        summary: "Create a journal entry (supports file upload) [admin]",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "journal_text", "child_id"],
                properties: {
                  title: { type: "string" },
                  journal_text: { type: "string" },
                  child_id: { type: "integer" },
                  mood_rating: { type: "integer" },
                  emotion_tags: { type: "string", description: "JSON array string, e.g. [\"happy\",\"calm\"]" },
                  social_interaction: { type: "string" },
                  assessment_type: { type: "string" },
                  notes: { type: "string" },
                  activities: { type: "string", description: "JSON array string or comma-separated" },
                  uploadedFile: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Journal created", content: { "application/json": { schema: { $ref: "#/components/schemas/Journal" } } } },
          500: { description: "Server error" },
        },
      },
    },
    "/journal/child/{childId}": {
      get: {
        tags: ["Journal"],
        summary: "Get all journals for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Journal list with count" }, 404: { description: "Not found" } },
      },
    },
    "/journal/single/{id}": {
      get: {
        tags: ["Journal"],
        summary: "Get a single journal by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Journal object", content: { "application/json": { schema: { $ref: "#/components/schemas/Journal" } } } }, 404: { description: "Not found" } },
      },
    },
    "/journal/delete/{id}": {
      delete: {
        tags: ["Journal"],
        summary: "Soft-delete a journal",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // COMMENT
    // ══════════════════════════════════════════════════════════════════════
    "/comment/add": {
      post: {
        tags: ["Comment"],
        summary: "Create a comment on a journal [admin or child]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["adminId", "journalId", "text"],
                properties: {
                  adminId: { type: "integer" },
                  journalId: { type: "integer" },
                  text: { type: "string" },
                  visible: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Comment created", content: { "application/json": { schema: { $ref: "#/components/schemas/Comment" } } } }, 404: { description: "Journal or admin not found" } },
      },
    },
    "/comment/getbyjournal/{journalId}": {
      get: {
        tags: ["Comment"],
        summary: "Get all visible comments for a journal (admin view)",
        parameters: [{ name: "journalId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Comment list" }, 404: { description: "Journal not found" } },
      },
    },
    "/comment/user/{journalId}": {
      get: {
        tags: ["Comment"],
        summary: "Get all visible comments for a journal (user view)",
        parameters: [{ name: "journalId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Comment list" }, 404: { description: "Journal not found" } },
      },
    },
    "/comment/getbyId/{id}": {
      get: {
        tags: ["Comment"],
        summary: "Get a single comment by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Comment object" }, 404: { description: "Not found" } },
      },
    },
    "/comment/delete/{id}": {
      delete: {
        tags: ["Comment"],
        summary: "Soft-delete a comment",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // ACTIVITY
    // ══════════════════════════════════════════════════════════════════════
    "/activity/add": {
      post: {
        tags: ["Activity"],
        summary: "Add a new activity (supports file upload) [admin]",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["activity_type", "child_id", "title", "date", "time"],
                properties: {
                  activity_type: { type: "string" },
                  child_id: { type: "integer" },
                  title: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  time: { type: "string" },
                  admin_id: { type: "integer" },
                  status: { type: "string" },
                  attachments: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Activity created", content: { "application/json": { schema: { $ref: "#/components/schemas/Activity" } } } } },
      },
    },
    "/activity/getadminId/{adminId}": {
      get: {
        tags: ["Activity"],
        summary: "Get activities by admin ID",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Activity list" }, 404: { description: "Not found" } },
      },
    },
    "/activity/child/{childId}": {
      get: {
        tags: ["Activity"],
        summary: "Get activities by child ID",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Activity list" }, 404: { description: "Not found" } },
      },
    },
    "/activity/recent/{childId}": {
      get: {
        tags: ["Activity"],
        summary: "Get recent activities for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Recent activity list" } },
      },
    },
    "/activity/getRecentActivities-admin/{adminId}": {
      get: {
        tags: ["Activity"],
        summary: "Get recent activities created by an admin",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Recent activity list" } },
      },
    },
    "/activity/get-by-country": {
      get: {
        tags: ["Activity"],
        summary: "Get activities filtered by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Activity list" } },
      },
    },
    "/activity/delete/{id}": {
      delete: {
        tags: ["Activity"],
        summary: "Soft-delete an activity",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // TASK
    // ══════════════════════════════════════════════════════════════════════
    "/tasks/create": {
      post: {
        tags: ["Task"],
        summary: "Create a new task [admin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["task_title", "child_id"],
                properties: {
                  task_title: { type: "string" },
                  description: { type: "string" },
                  child_name: { type: "string" },
                  child_id: { type: "integer" },
                  admin_id: { type: "integer" },
                  due_date: { type: "string", format: "date-time" },
                  due_time: { type: "string" },
                  priority: { type: "string" },
                  task_type: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Task created", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } } },
      },
    },
    "/tasks/alltasks": {
      get: {
        tags: ["Task"],
        summary: "Get all tasks",
        responses: { 200: { description: "Task list with count" } },
      },
    },
    "/tasks/singletasks/{taskId}": {
      get: {
        tags: ["Task"],
        summary: "Get a single task by ID",
        parameters: [{ name: "taskId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Task object", content: { "application/json": { schema: { $ref: "#/components/schemas/Task" } } } }, 404: { description: "Not found" } },
      },
    },
    "/tasks/child/{childId}": {
      get: {
        tags: ["Task"],
        summary: "Get tasks for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Task list with count" } },
      },
    },
    "/tasks/getTasksByAdminId/{adminId}": {
      get: {
        tags: ["Task"],
        summary: "Get tasks created by an admin",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Task list with count" } },
      },
    },
    "/tasks/count-Tasks-ByType": {
      get: {
        tags: ["Task"],
        summary: "Count tasks grouped by type for a country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Array of { task_type, count }" } },
      },
    },
    "/tasks/delete/{id}": {
      delete: {
        tags: ["Task"],
        summary: "Soft-delete a task",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // REPORTS
    // ══════════════════════════════════════════════════════════════════════
    "/reports/add": {
      post: {
        tags: ["Report"],
        summary: "Create a new report [admin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["admin_id", "child_id"],
                properties: {
                  admin_id: { type: "integer" },
                  child_id: { type: "integer" },
                  report_type: { type: "string" },
                  urgency_level: { type: "string" },
                  general_condition: { type: "string" },
                  recent_doctor_visits: { type: "string" },
                  nutrition_status: { type: "string" },
                  physical_activities: { type: "string" },
                  academic_performance: { type: "string" },
                  attendance_participation: { type: "string" },
                  mental_state: { type: "string" },
                  social_integration: { type: "string" },
                  financial_needs: { type: "string" },
                  existing_support: { type: "string" },
                  notable_events: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  time: { type: "string" },
                  additional_notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Report created", content: { "application/json": { schema: { $ref: "#/components/schemas/Report" } } } } },
      },
    },
    "/reports/by-Id/{id}": {
      get: {
        tags: ["Report"],
        summary: "Get report by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Report object" }, 404: { description: "Not found" } },
      },
    },
    "/reports/update/{id}": {
      put: {
        tags: ["Report"],
        summary: "Update a report",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Report" } } } },
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
      },
    },
    "/reports/delete/{id}": {
      delete: {
        tags: ["Report"],
        summary: "Soft-delete a report",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },
    "/reports/get-by-admin/{adminId}": {
      get: {
        tags: ["Report"],
        summary: "Get reports by admin ID",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Report list with count" } },
      },
    },
    "/reports/getReportsByChildId/{childId}": {
      get: {
        tags: ["Report"],
        summary: "Get reports for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Report list with count" } },
      },
    },
    "/reports/get-by-country": {
      get: {
        tags: ["Report"],
        summary: "Get reports filtered by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Report list with count" } },
      },
    },
    "/reports/getUrgentReports": {
      get: {
        tags: ["Report"],
        summary: "Get urgent reports by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Urgent report list" } },
      },
    },
    "/reports/count-Reports-ByType": {
      get: {
        tags: ["Report"],
        summary: "Count reports grouped by type",
        responses: { 200: { description: "Array of { location, urgency_level, count }" } },
      },
    },
    "/reports/getCountryWiseTrends": {
      get: {
        tags: ["Report"],
        summary: "Get monthly wellbeing trends by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Array of { month, academic_performance, social_integration, mental_state }" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // LEARNING MATERIALS
    // ══════════════════════════════════════════════════════════════════════
    "/learningmaterials/add": {
      post: {
        tags: ["LearningMaterial"],
        summary: "Add a learning material (supports file upload) [admin]",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "admin_id"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  related_tag: { type: "string" },
                  due_date: { type: "string", format: "date-time" },
                  due_time: { type: "string" },
                  priority: { type: "string" },
                  task_type: { type: "string" },
                  admin_id: { type: "integer" },
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Learning material created" } },
      },
    },
    "/learningmaterials/all": {
      get: {
        tags: ["LearningMaterial"],
        summary: "Get all learning materials",
        responses: { 200: { description: "Learning material list with count" } },
      },
    },
    "/learningmaterials/single/{id}": {
      get: {
        tags: ["LearningMaterial"],
        summary: "Get a learning material by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Learning material object" }, 404: { description: "Not found" } },
      },
    },
    "/learningmaterials/getByAdminId/{adminId}": {
      get: {
        tags: ["LearningMaterial"],
        summary: "Get learning materials by admin ID",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Learning material list with count" } },
      },
    },
    "/learningmaterials/get-by-country": {
      get: {
        tags: ["LearningMaterial"],
        summary: "Get learning materials by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Learning material list with count" } },
      },
    },
    "/learningmaterials/getLearningMaterialsByTag": {
      get: {
        tags: ["LearningMaterial"],
        summary: "Get learning materials by tag",
        parameters: [{ name: "relatedTag", in: "query", required: false, schema: { type: "string" } }],
        responses: { 200: { description: "Learning material list with count" } },
      },
    },
    "/learningmaterials/delete/{id}": {
      delete: {
        tags: ["LearningMaterial"],
        summary: "Soft-delete a learning material",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // ANNOUNCEMENTS
    // ══════════════════════════════════════════════════════════════════════
    "/announcements/add": {
      post: {
        tags: ["Announcement"],
        summary: "Create an announcement [admin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  priority: { type: "string", default: "normal" },
                  superadmin_id: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Announcement created" } },
      },
    },
    "/announcements/all": {
      get: {
        tags: ["Announcement"],
        summary: "Get all announcements",
        responses: { 200: { description: "Announcement list" } },
      },
    },
    "/announcements/getbyId/{id}": {
      get: {
        tags: ["Announcement"],
        summary: "Get announcement by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Announcement object" }, 404: { description: "Not found" } },
      },
    },
    "/announcements/getbyadminId/{superadminId}": {
      get: {
        tags: ["Announcement"],
        summary: "Get announcements by superadmin ID",
        parameters: [{ name: "superadminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Announcement list" } },
      },
    },
    "/announcements/update/{id}": {
      put: {
        tags: ["Announcement"],
        summary: "Update an announcement",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  priority: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
      },
    },
    "/announcements/delete/{id}": {
      delete: {
        tags: ["Announcement"],
        summary: "Soft-delete an announcement",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // VISIT PLANNING
    // ══════════════════════════════════════════════════════════════════════
    "/visitPlannings/create": {
      post: {
        tags: ["VisitPlanning"],
        summary: "Create a visit plan [admin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["child_id", "admin_id", "visit_date"],
                properties: {
                  child_id: { type: "integer" },
                  admin_id: { type: "integer" },
                  visit_date: { type: "string", format: "date-time" },
                  visit_time: { type: "string" },
                  visit_type: { type: "string" },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Visit plan created" } },
      },
    },
    "/visitPlannings/all": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get all visit plans",
        responses: { 200: { description: "Visit plan list" } },
      },
    },
    "/visitPlannings/single/{id}": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get visit plan by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Visit plan object" }, 404: { description: "Not found" } },
      },
    },
    "/visitPlannings/child/{childId}": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get visit plans for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Visit plan list" } },
      },
    },
    "/visitPlannings/admin/{adminId}": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get visit plans for an admin",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Visit plan list" } },
      },
    },
    "/visitPlannings/upcoming": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get all upcoming visit plans",
        responses: { 200: { description: "Upcoming visit plan list with count" } },
      },
    },
    "/visitPlannings/getUpcomingVisitsByChild/{childId}": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get upcoming visits for a specific child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Upcoming visit list" } },
      },
    },
    "/visitPlannings/visit-statistics": {
      get: {
        tags: ["VisitPlanning"],
        summary: "Get monthly visit statistics for the current year",
        responses: { 200: { description: "Array of { month, count }" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // VISIT REPORTS
    // ══════════════════════════════════════════════════════════════════════
    "/visitReports/create": {
      post: {
        tags: ["VisitReport"],
        summary: "Create a visit report [admin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["child_id", "admin_id"],
                properties: {
                  child_id: { type: "integer" },
                  donor_id: { type: "integer" },
                  visit_date: { type: "string", format: "date-time" },
                  visit_time: { type: "string" },
                  visit_type: { type: "string" },
                  notes: { type: "string" },
                  status: { type: "string" },
                  admin_id: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Visit report created" } },
      },
    },
    "/visitReports/getall": {
      get: {
        tags: ["VisitReport"],
        summary: "Get all visit reports",
        responses: { 200: { description: "Visit report list" } },
      },
    },
    "/visitReports/single/{id}": {
      get: {
        tags: ["VisitReport"],
        summary: "Get visit report by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Visit report object" }, 404: { description: "Not found" } },
      },
    },
    "/visitReports/child/{childId}": {
      get: {
        tags: ["VisitReport"],
        summary: "Get visit reports for a child (grouped into upcoming and past)",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "{ upcomingVisits, pastVisits }" } },
      },
    },
    "/visitReports/getVisitReportsByChildId/{childId}": {
      get: {
        tags: ["VisitReport"],
        summary: "Get visit reports for a child (grouped into upcoming and past)",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "{ upcomingVisits, pastVisits }" } },
      },
    },
    "/visitReports/getLatestVisit/{childId}": {
      get: {
        tags: ["VisitReport"],
        summary: "Get latest visit reports for a child",
        parameters: [{ name: "childId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Latest visit report list" }, 404: { description: "Not found" } },
      },
    },
    "/visitReports/getByAdminId/{adminId}": {
      get: {
        tags: ["VisitReport"],
        summary: "Get visit reports by admin ID",
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Visit report list" } },
      },
    },
    "/visitReports/getUrgentVisitReports": {
      get: {
        tags: ["VisitReport"],
        summary: "Get urgent visit reports by country",
        parameters: [{ name: "country", in: "query", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Urgent visit report list" } },
      },
    },
    "/visitReports/delete/{id}": {
      delete: {
        tags: ["VisitReport"],
        summary: "Soft-delete a visit report",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },

    // ══════════════════════════════════════════════════════════════════════
    // MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════
    "/management/add": {
      post: {
        tags: ["Management"],
        summary: "Add a management member [superadmin]",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["full_name", "email"],
                properties: {
                  full_name: { type: "string" },
                  email: { type: "string" },
                  phone_number: { type: "string" },
                  country: { type: "string" },
                  role: { type: "string" },
                  superadmin_id: { type: "integer" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Management member created" } },
      },
    },
    "/management/getBySuperadmin/{superadminId}": {
      get: {
        tags: ["Management"],
        summary: "Get management members by superadmin ID [superadmin]",
        parameters: [{ name: "superadminId", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Management member list with count" } },
      },
    },
    "/management/delete/{id}": {
      delete: {
        tags: ["Management"],
        summary: "Soft-delete a management member [superadmin]",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } },
      },
    },
  },
};

module.exports = swaggerDefinition;
