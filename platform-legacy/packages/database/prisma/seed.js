"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('Admin123!', 12);
    const user = await prisma.user.upsert({
        where: { email: 'admin@loraloop.com' },
        update: {},
        create: {
            email: 'admin@loraloop.com',
            name: 'Admin',
            passwordHash,
            emailVerified: true,
            provider: 'LOCAL',
        },
    });
    const org = await prisma.organization.upsert({
        where: { slug: 'my-organization' },
        update: {},
        create: {
            name: 'My Organization',
            slug: 'my-organization',
        },
    });
    await prisma.orgMember.upsert({
        where: { orgId_userId: { orgId: org.id, userId: user.id } },
        update: {},
        create: { orgId: org.id, userId: user.id, role: 'OWNER', accepted: true },
    });
    await prisma.subscription.upsert({
        where: { orgId: org.id },
        update: {},
        create: { orgId: org.id, plan: 'FREE', period: 'MONTHLY' },
    });
    console.log(`Seed complete`);
    console.log(`User: admin@loraloop.com / Admin123!`);
    console.log(`Org ID: ${org.id}`);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map