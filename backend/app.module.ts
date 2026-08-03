import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Root module. Intentionally minimal — feature modules for auth/, api/,
// services/, storage/, memory/, and database/ get imported here as each
// is actually built. See ARCHITECTURE.md §7 for what each owns.
// Do not import ai/inference or anything from the FastAPI service directly
// here — the boundary is an HTTP/API call, not a shared import.
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
