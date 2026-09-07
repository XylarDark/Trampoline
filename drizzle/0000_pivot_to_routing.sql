CREATE TYPE "public"."accommodation_status" AS ENUM('requested', 'in_discussion', 'provided', 'declined', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."attestation_event_kind" AS ENUM('issued', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."attestation_result" AS ENUM('pass', 'fail', 'restricted');--> statement-breakpoint
CREATE TYPE "public"."check_domain" AS ENUM('medical', 'wellness', 'mental', 'skills');--> statement-breakpoint
CREATE TYPE "public"."follow_up_contact" AS ENUM('reached', 'no_response', 'declined_to_answer', 'unreachable');--> statement-breakpoint
CREATE TYPE "public"."gate_kind" AS ENUM('employment', 'training');--> statement-breakpoint
CREATE TYPE "public"."milestone_kind" AS ENUM('placement_start', 'weeks_6_cumulative', 'weeks_13_cumulative', 'hours_20_plus', 'employed_within_60_days_of_completion', 'retention_15_months', 'retention_33_months', 'program_completion');--> statement-breakpoint
CREATE TYPE "public"."org_kind" AS ENUM('vendor', 'school', 'employer', 'funder', 'clinic', 'wellness', 'mental', 'skills');--> statement-breakpoint
CREATE TYPE "public"."referral_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('sent', 'accepted', 'declined', 'placed', 'lost_contact');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'attestor', 'org_admin', 'funder');--> statement-breakpoint
CREATE TYPE "public"."satisfaction_respondent" AS ENUM('client', 'employer');--> statement-breakpoint
CREATE TYPE "public"."share_scope" AS ENUM('skills', 'functional_abilities', 'personal');--> statement-breakpoint
CREATE TYPE "public"."verification_source" AS ENUM('employer_confirmation', 'pay_stub', 'provider_case_note', 'self_report');--> statement-breakpoint
CREATE TABLE "accommodation_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"restriction_id" uuid,
	"requested_support" text NOT NULL,
	"status" "accommodation_status" DEFAULT 'requested' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "attestation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attestation_id" uuid NOT NULL,
	"kind" "attestation_event_kind" NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reason" text
);
--> statement-breakpoint
CREATE TABLE "attestation_restrictions" (
	"attestation_id" uuid NOT NULL,
	"restriction_id" uuid NOT NULL,
	CONSTRAINT "attestation_restrictions_attestation_id_restriction_id_pk" PRIMARY KEY("attestation_id","restriction_id")
);
--> statement-breakpoint
CREATE TABLE "attestations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"check_type_id" uuid NOT NULL,
	"attestor_user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"result" "attestation_result" NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "check_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"domain" "check_domain" NOT NULL,
	"label" text NOT NULL,
	"rubric_summary" text NOT NULL,
	"rubric_url" text,
	"validity_days" integer NOT NULL,
	"required_attestor_kind" "org_kind" NOT NULL,
	"requires_regulated_attestor" boolean DEFAULT false NOT NULL,
	CONSTRAINT "check_types_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "dual_intakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"health_load" smallint NOT NULL,
	"work_load" smallint NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employment_spells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placement_id" uuid NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone,
	"weekly_hours" numeric(5, 2) NOT NULL,
	"hourly_wage" numeric(7, 2),
	"verification_source" "verification_source" NOT NULL,
	"verified_by_organization_id" uuid,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "exit_satisfaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"placement_id" uuid,
	"respondent" "satisfaction_respondent" NOT NULL,
	"score" smallint NOT NULL,
	"would_use_again" boolean,
	"comment" text,
	"collected_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exit_satisfaction_score_range" CHECK ("exit_satisfaction"."score" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "gates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"kind" "gate_kind" NOT NULL,
	"definition" jsonb NOT NULL,
	"safety_rationale" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gates_key_unique" UNIQUE("key"),
	CONSTRAINT "gates_employment_is_skills_only" CHECK ("gates"."kind" <> 'employment' OR NOT ("gates"."definition" ?| array['requiredLevel', 'restrictionsMustBeClear', 'pauseOnHealthDrop'])),
	CONSTRAINT "gates_health_derived_training_needs_rationale" CHECK ("gates"."kind" <> 'training'
        OR NOT ("gates"."definition" ?| array['requiredLevel', 'restrictionsMustBeClear'])
        OR length(coalesce("gates"."safety_rationale", '')) >= 20)
);
--> statement-breakpoint
CREATE TABLE "level_requirements" (
	"level" smallint NOT NULL,
	"check_type_id" uuid NOT NULL,
	CONSTRAINT "level_requirements_level_check_type_id_pk" PRIMARY KEY("level","check_type_id")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "memberships_user_org_unique" UNIQUE("user_id","organization_id","role")
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"seats" integer DEFAULT 1 NOT NULL,
	"gate_id" uuid NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"kind" "org_kind" NOT NULL,
	"regulated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outcome_follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"placement_id" uuid,
	"months_after_exit" smallint NOT NULL,
	"contacted_on" timestamp with time zone NOT NULL,
	"contact_outcome" "follow_up_contact" NOT NULL,
	"employed" boolean,
	"weekly_hours" numeric(5, 2),
	"hourly_wage" numeric(7, 2),
	"in_education_or_training" boolean,
	CONSTRAINT "outcome_follow_ups_once_per_window" UNIQUE("user_id","placement_id","months_after_exit"),
	CONSTRAINT "outcome_follow_ups_reported_window" CHECK ("outcome_follow_ups"."months_after_exit" IN (1, 3, 6, 12, 15, 33))
);
--> statement-breakpoint
CREATE TABLE "outcome_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"placement_id" uuid,
	"kind" "milestone_kind" NOT NULL,
	"achieved_on" timestamp with time zone NOT NULL,
	"cumulative_weeks" numeric(6, 2),
	"weekly_hours_at_milestone" numeric(5, 2),
	"evidence_note" text,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "outcome_milestones_once_per_placement" UNIQUE("user_id","placement_id","kind")
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"employer_organization_id" uuid,
	"opportunity_id" uuid,
	"referral_id" uuid,
	"job_title" text NOT NULL,
	"noc_code" text,
	"started_on" timestamp with time zone NOT NULL,
	"ended_on" timestamp with time zone,
	"end_reason" text,
	"gate_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"direction" "referral_direction" NOT NULL,
	"from_organization_id" uuid,
	"to_organization_id" uuid NOT NULL,
	"opportunity_id" uuid,
	"supported" boolean DEFAULT true NOT NULL,
	"status" "referral_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_at" timestamp with time zone,
	"declined_reason" text
);
--> statement-breakpoint
CREATE TABLE "restrictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"label" text NOT NULL,
	"compatible_tags" text[] DEFAULT '{}' NOT NULL,
	CONSTRAINT "restrictions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "share_access_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"share_link_id" uuid NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"scope_served" "share_scope" NOT NULL,
	"viewer_ip_hash" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "share_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"scope" "share_scope" DEFAULT 'skills' NOT NULL,
	"recipient_label" text NOT NULL,
	"recipient_organization_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "share_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_level" smallint DEFAULT 0 NOT NULL,
	"level_computed_at" timestamp with time zone,
	"health_renewal_due_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tracks_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"email_verified" timestamp with time zone,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accommodation_requests" ADD CONSTRAINT "accommodation_requests_restriction_id_restrictions_id_fk" FOREIGN KEY ("restriction_id") REFERENCES "public"."restrictions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestation_events" ADD CONSTRAINT "attestation_events_attestation_id_attestations_id_fk" FOREIGN KEY ("attestation_id") REFERENCES "public"."attestations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestation_events" ADD CONSTRAINT "attestation_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestation_restrictions" ADD CONSTRAINT "attestation_restrictions_attestation_id_attestations_id_fk" FOREIGN KEY ("attestation_id") REFERENCES "public"."attestations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestation_restrictions" ADD CONSTRAINT "attestation_restrictions_restriction_id_restrictions_id_fk" FOREIGN KEY ("restriction_id") REFERENCES "public"."restrictions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_check_type_id_check_types_id_fk" FOREIGN KEY ("check_type_id") REFERENCES "public"."check_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_attestor_user_id_users_id_fk" FOREIGN KEY ("attestor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attestations" ADD CONSTRAINT "attestations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dual_intakes" ADD CONSTRAINT "dual_intakes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_spells" ADD CONSTRAINT "employment_spells_placement_id_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employment_spells" ADD CONSTRAINT "employment_spells_verified_by_organization_id_organizations_id_fk" FOREIGN KEY ("verified_by_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exit_satisfaction" ADD CONSTRAINT "exit_satisfaction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exit_satisfaction" ADD CONSTRAINT "exit_satisfaction_placement_id_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."placements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_requirements" ADD CONSTRAINT "level_requirements_check_type_id_check_types_id_fk" FOREIGN KEY ("check_type_id") REFERENCES "public"."check_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_gate_id_gates_id_fk" FOREIGN KEY ("gate_id") REFERENCES "public"."gates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_follow_ups" ADD CONSTRAINT "outcome_follow_ups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_follow_ups" ADD CONSTRAINT "outcome_follow_ups_placement_id_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."placements"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_milestones" ADD CONSTRAINT "outcome_milestones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome_milestones" ADD CONSTRAINT "outcome_milestones_placement_id_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_employer_organization_id_organizations_id_fk" FOREIGN KEY ("employer_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_referral_id_referrals_id_fk" FOREIGN KEY ("referral_id") REFERENCES "public"."referrals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_gate_id_gates_id_fk" FOREIGN KEY ("gate_id") REFERENCES "public"."gates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_from_organization_id_organizations_id_fk" FOREIGN KEY ("from_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_to_organization_id_organizations_id_fk" FOREIGN KEY ("to_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_access_log" ADD CONSTRAINT "share_access_log_share_link_id_share_links_id_fk" FOREIGN KEY ("share_link_id") REFERENCES "public"."share_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_recipient_organization_id_organizations_id_fk" FOREIGN KEY ("recipient_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;