export function explainJavaSpringOffline(errorLog: string): string {
  const log = errorLog.toLowerCase();

  if (log.includes("beancreationexception") || log.includes("bean creation")) {
    return `## Root cause
**Spring failed to create a bean** — missing dependency, circular reference, or misconfiguration in your application context.

## What happened
The IoC container could not instantiate or wire a \`@Component\`, \`@Service\`, or \`@Repository\`. Check the nested \`Caused by:\` for the real failure (missing class, constructor error, or unsatisfied dependency).

## How to fix
- Read the **innermost Caused by** in the stack trace
- Verify \`@Autowired\` targets exist and are component-scanned
- Break **circular dependencies** with \`@Lazy\` or refactor constructors
- Confirm profile-specific beans (\`application.yml\`) are loaded

## Prevention
- Prefer constructor injection over field injection
- Use \`@Configuration\` tests to validate context startup in CI

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("connection refused") || log.includes("connect timed out")) {
    return `## Root cause
**Network connection failed** — downstream service (database, API, cache) is unreachable from your app.

## What happened
The JVM could not open a TCP connection. Common causes: service down, wrong host/port, firewall, Docker network, or VPN.

## How to fix
- Verify host and port in \`application.properties\` / env vars
- \`curl\` or \`telnet\` from the same pod/host
- Check DB/API is running and accepting connections
- For Kubernetes: Service name, namespace, and network policies

## Prevention
- Health checks and readiness probes
- Connection pool timeouts with clear logging

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("outofmemoryerror") || log.includes("java heap space")) {
    return `## Root cause
**JVM heap exhausted** — not enough memory for objects on the heap (distinct from Spark executor OOM but similar symptoms).

## What happened
The garbage collector could not free enough space. Triggers: memory leaks, oversized caches, loading huge files into memory, or heap too small for workload.

## How to fix
- Increase \`-Xmx\` (e.g. \`-Xmx2g\`)
- Capture heap dump: \`-XX:+HeapDumpOnOutOfMemoryError\`
- Analyze with Eclipse MAT or VisualVM for leaks
- Review unbounded collections, caches, and \`@Cacheable\` growth

## Prevention
- Set heap based on container limits (K8s \`resources.limits.memory\`)
- Use streaming for large files; paginate DB reads

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("sqlsyntaxerrorexception") || log.includes("bad sql grammar")) {
    return `## Root cause
**Invalid SQL** sent to the database — syntax error or dialect mismatch (MySQL vs Postgres, etc.).

## What happened
JPA/Hibernate or \`JdbcTemplate\` executed a malformed query. Check the logged SQL and the \`Caused by\` from the JDBC driver.

## How to fix
- Copy the SQL from the log and run in your DB client
- Verify dialect in \`spring.jpa.database-platform\`
- For native queries, validate table/column names against schema

## Prevention
- Use Flyway/Liquibase for schema consistency
- Integration tests against real DB in CI

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  if (log.includes("access denied") || log.includes("401") || log.includes("403")) {
    return `## Root cause
**Authentication or authorization failure** — credentials rejected or insufficient permissions.

## What happened
Spring Security, OAuth, or an upstream API returned unauthorized/forbidden. Token may be expired, missing, or scopes insufficient.

## How to fix
- Verify JWT/API key and expiration
- Check SecurityFilterChain rules for the endpoint
- Confirm roles/authorities on \`@PreAuthorize\`

## Prevention
- Centralize auth config; log auth failures without secrets

---
*Instant analysis — pattern-matched locally. AI-enhanced analysis returns when capacity is available.*`;
  }

  return `## Root cause
Find the **first \`Caused by:\`** or \`ERROR\` line — that is usually the real failure beneath wrapper exceptions.

## What happened
A Java/Spring application error occurred. Spring Boot logs often wrap the root exception in \`ServletException\` or \`ApplicationContextException\`.

## How to fix
1. Search for \`Caused by:\` from bottom-up (last cause is often root)
2. Note exception type: \`NullPointerException\`, \`IllegalArgumentException\`, etc.
3. Match stack frame to your package (not Spring internals)
4. Reproduce locally with same profile (\`spring.profiles.active\`)

## Prevention
- Enable debug for your package only: \`logging.level.com.yourapp=DEBUG\`
- Use structured JSON logging in production

---
*Instant analysis — general Java/Spring guidance. AI-enhanced analysis returns when capacity is available.*`;
}
