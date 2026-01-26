# Deployment Checklist

Use this checklist to ensure your bot is properly configured and deployed.

## Pre-Deployment

### Discord Bot Setup
- [ ] Created Discord application at [Developer Portal](https://discord.com/developers/applications)
- [ ] Created bot user and copied token
- [ ] Enabled Privileged Gateway Intents:
  - [ ] SERVER MEMBERS INTENT
  - [ ] MESSAGE CONTENT INTENT
- [ ] Generated invite URL with correct permissions
- [ ] Invited bot to your Discord server
- [ ] Bot appears in member list (offline is OK for now)

### Local Environment
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MongoDB installed and running
- [ ] FFmpeg installed (`ffmpeg -version`)
- [ ] Git installed (optional, for version control)

### Project Setup
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`
- [ ] `.env` file configured with:
  - [ ] DISCORD_TOKEN
  - [ ] CLIENT_ID
  - [ ] GUILD_ID
  - [ ] MONGODB_URI
- [ ] `.env` file added to `.gitignore`

### Initial Testing
- [ ] Commands deployed successfully (`npm run deploy`)
- [ ] Bot starts without errors (`npm start`)
- [ ] Bot shows as online in Discord
- [ ] Bot responds to `/rank` command
- [ ] Bot tracks messages and awards XP
- [ ] Bot plays music with `/play` command

## Production Deployment

### VPS/Server Setup (if applicable)
- [ ] VPS provisioned (DigitalOcean, Vultr, AWS, etc.)
- [ ] SSH access configured
- [ ] Firewall configured (allow SSH, block unnecessary ports)
- [ ] Node.js installed on server
- [ ] MongoDB installed on server OR MongoDB Atlas configured
- [ ] FFmpeg installed on server
- [ ] Project files uploaded to server

### Database Configuration
- [ ] MongoDB running and accessible
- [ ] Database connection tested
- [ ] Database authentication configured (if using remote DB)
- [ ] Backup strategy planned

### Application Deployment

#### Option 1: PM2 (Recommended for VPS)
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Bot started with PM2 (`pm2 start ecosystem.config.js`)
- [ ] PM2 configured to auto-start on reboot (`pm2 startup`)
- [ ] PM2 configuration saved (`pm2 save`)
- [ ] Logs accessible (`pm2 logs discord-bot`)

#### Option 2: Docker
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] `.env` file configured
- [ ] Built image (`docker-compose build`)
- [ ] Started containers (`docker-compose up -d`)
- [ ] Containers running (`docker ps`)
- [ ] Logs accessible (`docker-compose logs -f`)

#### Option 3: Systemd Service
- [ ] Service file created in `/etc/systemd/system/`
- [ ] Service enabled (`systemctl enable discord-bot`)
- [ ] Service started (`systemctl start discord-bot`)
- [ ] Service status checked (`systemctl status discord-bot`)

### Security Hardening
- [ ] `.env` file permissions restricted (`chmod 600 .env`)
- [ ] Bot token never committed to Git
- [ ] MongoDB authentication enabled
- [ ] MongoDB not exposed to public internet (unless necessary)
- [ ] Firewall rules configured
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Regular security updates scheduled

### Monitoring & Maintenance
- [ ] Log rotation configured
- [ ] Disk space monitoring set up
- [ ] Database backup automation configured
- [ ] Uptime monitoring configured (optional: UptimeRobot, etc.)
- [ ] Error alerting configured (optional: email, Discord webhook, etc.)
- [ ] Update schedule planned for dependencies

## Post-Deployment Verification

### Functionality Tests
- [ ] Bot is online in Discord server
- [ ] All slash commands appear in Discord
- [ ] `/rank` command works
- [ ] `/leaderboard` command works
- [ ] Messages award XP correctly
- [ ] Level up notifications appear
- [ ] `/play` command works with YouTube link
- [ ] `/play` command works with search query
- [ ] `/play` command works with Spotify link
- [ ] `/pause`, `/resume`, `/skip` commands work
- [ ] `/queue` command shows correct information
- [ ] `/nowplaying` command works
- [ ] `/volume` command changes volume
- [ ] `/stop` command stops music and clears queue

### Performance Tests
- [ ] Bot responds within 2-3 seconds
- [ ] Music plays without buffering
- [ ] Database queries are fast
- [ ] Memory usage is acceptable
- [ ] CPU usage is acceptable
- [ ] No memory leaks over 24 hours

### Reliability Tests
- [ ] Bot auto-restarts after crash
- [ ] Bot reconnects after network interruption
- [ ] Bot maintains database connection
- [ ] Bot handles invalid commands gracefully
- [ ] Bot handles permission errors gracefully

## Documentation
- [ ] README.md reviewed and accurate
- [ ] SETUP_GUIDE.md tested with fresh installation
- [ ] COMMANDS.md shared with server members
- [ ] Deployment notes documented for future reference
- [ ] Admin contacts documented

## Backup & Recovery
- [ ] Database backup tested
- [ ] Database restore tested
- [ ] `.env` file backed up securely (encrypted)
- [ ] Recovery procedure documented

## Scaling Considerations (Future)
- [ ] MongoDB Atlas considered for scalability
- [ ] Multiple server support tested (if needed)
- [ ] Load balancing considered (if needed)
- [ ] CDN for music caching considered (if needed)

## Maintenance Schedule

### Daily
- [ ] Check bot is online
- [ ] Review error logs

### Weekly
- [ ] Review disk space usage
- [ ] Check database size
- [ ] Review performance metrics

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Security patches applied
- [ ] Database backup verified
- [ ] Log files rotated/archived

### Quarterly
- [ ] Review and optimize database indexes
- [ ] Review and update documentation
- [ ] Performance tuning if needed

## Emergency Contacts
- Server Admin: _______________
- Bot Developer: _______________
- VPS Support: _______________
- MongoDB Support: _______________

## Emergency Procedures

### Bot Won't Start
1. Check logs: `pm2 logs` or `docker-compose logs`
2. Verify MongoDB is running
3. Verify `.env` configuration
4. Check Discord token is valid
5. Restart: `pm2 restart discord-bot`

### Bot Offline
1. Check server status
2. Check process: `pm2 list` or `docker ps`
3. Restart if needed
4. Check logs for errors

### Database Connection Issues
1. Check MongoDB status: `systemctl status mongod`
2. Test connection: `mongosh`
3. Restart MongoDB if needed
4. Check credentials in `.env`

### Out of Memory
1. Restart bot
2. Check memory usage: `free -h`
3. Increase VPS memory if consistently high
4. Check for memory leaks in logs

### Music Not Playing
1. Verify FFmpeg is installed
2. Check voice channel permissions
3. Test with different music source
4. Restart bot
5. Check extractors are loaded in logs

---

## Sign-off

- [ ] All checklist items completed
- [ ] Bot is stable in production
- [ ] Team trained on basic operations
- [ ] Documentation is accessible
- [ ] Ready for public use

**Deployed by:** _______________
**Date:** _______________
**Version:** _______________

---

## Notes

Use this section for deployment-specific notes, quirks, or important information:

```
[Add your notes here]
```
