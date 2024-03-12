import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel, Tracer } from '@opentelemetry/api';

const sdks: { [key: string]: Tracer } = {};
const exporter = new OTLPTraceExporter();

export default async (serviceName: string): Promise<Tracer> => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  if (sdks[serviceName]) {
    return Promise.resolve(sdks[serviceName]);
  }

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
    maxQueueSize: 1000,
    scheduledDelayMillis: 30000,
  }));

  provider.register();

  registerInstrumentations({
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });

  const tracer = provider.getTracer(serviceName);
  sdks[serviceName] = tracer;
  return tracer;
};