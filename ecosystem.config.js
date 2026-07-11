/**
 * PM2 process manager config. PM2 keeps the Next.js server alive, restarts
 * it if it crashes, and lets `deploy.sh` reload it with zero manual steps.
 *
 * One-time setup on the VPS (if not already done):
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup            # follow the printed command to enable on reboot
 */
module.exports = {
  apps: [
    {
      name: "IPU-ipuniversity",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3009",
      cwd: __dirname,
      instances: 1, // bump to "max" for cluster mode once traffic justifies it
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "500M",
      autorestart: true,
      watch: false, // never watch files in production — deploy.sh handles restarts
      out_file: "logs/pm2-out.log",
      error_file: "logs/pm2-error.log",
      time: true,
    },
  ],
};
