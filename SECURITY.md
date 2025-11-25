# Security Policy

## Supported Versions

We take security seriously and actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Eventora, please help us by reporting it responsibly.

### How to Report
- **Email**: security@talalakkari.com
- **Subject**: `[SECURITY] Eventora Vulnerability Report`
- **Include**:
  - Detailed description of the vulnerability
  - Steps to reproduce
  - Potential impact
  - Affected versions
  - Your contact information for follow-up

### What to Expect
- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Investigation**: We'll investigate and coordinate a fix
- **Updates**: We'll keep you informed of our progress
- **Disclosure**: We'll coordinate public disclosure after the fix is deployed

### Responsible Disclosure
- Please allow us reasonable time to fix the issue before public disclosure
- We'll credit you in our security advisory (unless you prefer anonymity)
- We follow industry-standard disclosure practices

### Scope
This policy applies to:
- The Eventora application codebase
- Official deployments and infrastructure
- Third-party integrations used by Eventora

### Out of Scope
- Vulnerabilities in third-party services (report directly to them)
- Issues that don't affect the security of user data
- Denial of service attacks without data compromise

## Security Best Practices

When deploying Eventora:

1. **Environment Variables**: Never commit API keys or secrets to version control
2. **Access Control**: Use proper authentication and authorization
3. **Input Validation**: Always validate and sanitize user inputs
4. **Updates**: Keep dependencies updated to latest secure versions
5. **Monitoring**: Implement proper logging and monitoring

## Contact

For security-related questions or concerns:
- **Email**: security@talalakkari.com
- **Response Time**: Within 48 hours for vulnerability reports

Thank you for helping keep Eventora and its users secure!