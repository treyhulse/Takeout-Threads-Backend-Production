-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('BAR_CHART', 'LINE_CHART', 'PIE_CHART', 'TABLE', 'KPI', 'FUNNEL', 'SCATTER_PLOT', 'HEATMAP', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportPermission" AS ENUM ('VIEW', 'EDIT', 'MANAGE');

-- CreateTable
CREATE TABLE "AnalyticsReport" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ReportType" NOT NULL,
    "config" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "last_run_at" TIMESTAMP(3),
    "schedule" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardReports" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSharing" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "permissions" "ReportPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportSharing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardSharing" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "permissions" "ReportPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardSharing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsReport_org_id_name_key" ON "AnalyticsReport"("org_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_org_id_name_key" ON "Dashboard"("org_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardReports_dashboard_id_report_id_key" ON "DashboardReports"("dashboard_id", "report_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReportSharing_report_id_shared_with_key" ON "ReportSharing"("report_id", "shared_with");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSharing_dashboard_id_shared_with_key" ON "DashboardSharing"("dashboard_id", "shared_with");

-- AddForeignKey
ALTER TABLE "DashboardReports" ADD CONSTRAINT "DashboardReports_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardReports" ADD CONSTRAINT "DashboardReports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "AnalyticsReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSharing" ADD CONSTRAINT "ReportSharing_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "AnalyticsReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardSharing" ADD CONSTRAINT "DashboardSharing_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
