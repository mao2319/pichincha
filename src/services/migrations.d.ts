/**
 * Complete database migration system
 * Applies all schema changes to Supabase
 */
export declare const migrationService: {
    applyAllMigrations(): Promise<{
        success: boolean;
        migrations: {
            name: string;
            status: string;
            error?: string;
        }[];
    }>;
    applyInitialSchema(): Promise<{
        success: boolean;
        error?: string;
    }>;
    applyRAGTables(): Promise<{
        success: boolean;
        error?: string;
    }>;
    verifyMigrations(): Promise<{
        success: boolean;
        tables: string[];
        missing: string[];
    }>;
    resetDatabase(): Promise<{
        success: boolean;
        error?: string;
    }>;
};
//# sourceMappingURL=migrations.d.ts.map