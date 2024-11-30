const nodemailer = require('nodemailer');
const db = require('../db');

class ReportService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email service
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async generateReport(type, startDate, endDate) {
    let data;
    switch (type) {
      case 'sessions':
        data = await this.getSessionAnalytics(startDate, endDate);
        break;
      case 'engagement':
        data = await this.getEngagementMetrics(startDate, endDate);
        break;
      case 'products':
        data = await this.getProductAnalytics(startDate, endDate);
        break;
      case 'revenue':
        data = await this.getRevenueAnalytics(startDate, endDate);
        break;
    }
    return this.formatReport(type, data);
  }

  async sendReport(recipients, reportData) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipients.join(','),
      subject: `HeyBud Analytics Report - ${new Date().toLocaleDateString()}`,
      html: this.generateEmailTemplate(reportData)
    };

    return this.transporter.sendMail(mailOptions);
  }

  private async getSessionAnalytics(startDate, endDate) {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_sessions,
        AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_duration
      FROM sessions
      WHERE created_at BETWEEN $1 AND $2
      GROUP BY DATE(created_at)
      ORDER BY date;
    `;
    return db.query(query, [startDate, endDate]);
  }

  private generateEmailTemplate(data) {
    // Generate HTML email template with charts and data
    return `
      <html>
        <body>
          <h1>HeyBud Analytics Report</h1>
          ${this.generateReportSections(data)}
        </body>
      </html>
    `;
  }
}

module.exports = new ReportService();