import { useEffect } from 'react';
import { generateStructuredData } from '../seo/schema';

export default function StructuredData() {
  useEffect(() => {
    const scriptId = 'structured-data-ldjson';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    const schemaData = generateStructuredData();
    const jsonString = JSON.stringify(schemaData, null, 2);

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      scriptTag.text = jsonString;
      document.head.appendChild(scriptTag);
    } else {
      scriptTag.text = jsonString;
    }
  }, []);

  return null;
}

