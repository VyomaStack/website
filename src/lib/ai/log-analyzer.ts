import { explainGenericLogOffline } from "@/lib/ai/fallbacks/generic-log";
import { explainJavaSpringOffline } from "@/lib/ai/fallbacks/java-spring";
import { explainSparkErrorOffline } from "@/lib/ai/fallbacks/spark";
import { isLogLikeText, SPARK_HINT } from "@/lib/ai/log-patterns";

export type LogType = "auto" | "spark" | "java-spring" | "generic";

export function detectLogType(log: string): Exclude<LogType, "auto"> {
  const lower = log.toLowerCase();

  if (
    lower.includes("org.apache.spark") ||
    lower.includes("sparkoutofmemory") ||
    lower.includes("shuffle") && lower.includes("spark") ||
    lower.includes("executor lost") && lower.includes("stage") ||
    (SPARK_HINT.test(log) &&
      (lower.includes("failed") ||
        lower.includes("abort") ||
        lower.includes("killed") ||
        lower.includes("memory")))
  ) {
    return "spark";
  }

  if (
    lower.includes("org.springframework") ||
    lower.includes("beancreationexception") ||
    lower.includes("springframework") ||
    lower.includes("spring boot") ||
    lower.includes("hibernate") ||
    lower.includes("tomcat") ||
    (lower.includes("caused by:") && lower.includes("java."))
  ) {
    return "java-spring";
  }

  return "generic";
}

export function resolveLogType(
  logType: LogType,
  log: string
): Exclude<LogType, "auto"> {
  return logType === "auto" ? detectLogType(log) : logType;
}

export function analyzeLogOffline(
  log: string,
  logType: LogType
): { text: string; resolvedType: Exclude<LogType, "auto"> } {
  const resolvedType = resolveLogType(logType, log);

  switch (resolvedType) {
    case "spark":
      return { text: explainSparkErrorOffline(log), resolvedType };
    case "java-spring":
      return { text: explainJavaSpringOffline(log), resolvedType };
    case "generic":
      return { text: explainGenericLogOffline(log), resolvedType };
  }
}

export const LOG_TYPE_LABELS: Record<Exclude<LogType, "auto">, string> = {
  spark: "Apache Spark",
  "java-spring": "Java / Spring Boot",
  generic: "Generic application log",
};
