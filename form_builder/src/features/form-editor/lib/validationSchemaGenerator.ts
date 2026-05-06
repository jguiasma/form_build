import { z } from 'zod';
import type { FormField } from '../types/form-builder.types';

export const generateFieldSchema = (field: FormField) => {
  let schema: z.ZodTypeAny = z.string();

  // Basic Type Handling
  switch (field.type) {
    case 'email':
      schema = z.string().email('Please enter a valid email address');
      break;
    case 'number':
      schema = z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number({ invalid_type_error: 'Please enter a valid number' })
      );
      break;
    case 'checkbox':
      schema = z.array(z.string());
      break;
    case 'file':
      schema = z.any(); // We'll add custom refinements for files
      break;
    case 'date':
      schema = z.string().min(1, 'Date is required');
      break;
    default:
      schema = z.string();
  }

  // Required check
  if (field.is_required) {
    if (field.type === 'checkbox') {
      schema = (schema as z.ZodArray<any>).min(1, 'Please select at least one option');
    } else if (field.type === 'number') {
       // handled by preprocess + z.number()
    } else if (field.type === 'file') {
       schema = (schema as z.ZodAny).refine((files) => {
         if (!files) return false;
         if (Array.isArray(files)) return files.length > 0;
         if (files instanceof FileList) return files.length > 0;
         return !!files;
       }, 'File is required');
    } else {
      schema = (schema as z.ZodString).min(1, 'This field is required');
    }
  } else {
    // Make optional
    if (field.type === 'number') {
      schema = z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number().optional()
      );
    } else if (field.type === 'file') {
      schema = schema.optional().nullable();
    } else {
      schema = schema.optional().or(z.literal('')).nullable();
    }
  }

  // Validation Rules
  const rules = field.validation_rules || {};

  if (field.type === 'text' || field.type === 'textarea') {
    if (rules.min_length) schema = (schema as z.ZodString).min(Number(rules.min_length), `Minimum ${rules.min_length} characters`);
    if (rules.max_length) schema = (schema as z.ZodString).max(Number(rules.max_length), `Maximum ${rules.max_length} characters`);
    if (rules.pattern) {
      try {
        schema = (schema as z.ZodString).regex(new RegExp(rules.pattern), 'Invalid format');
      } catch (e) {
        console.error('Invalid regex pattern', rules.pattern);
      }
    }
  }

  if (field.type === 'number') {
    let numSchema = schema as z.ZodNumber;
    if (rules.min !== undefined && rules.min !== null) numSchema = numSchema.min(Number(rules.min));
    if (rules.max !== undefined && rules.max !== null) numSchema = numSchema.max(Number(rules.max));
    if (rules.step && rules.step !== 'any') {
       const step = Number(rules.step);
       numSchema = numSchema.step(step, `Value must be a multiple of ${step}`);
    }
    schema = numSchema;
  }

  if (field.type === 'file') {
    schema = (schema as z.ZodAny).refine((files) => {
      if (!files) return true; // Handled by required check
      const fileList = Array.isArray(files) ? files : (files instanceof FileList ? Array.from(files) : [files]);
      
      // Size check
      if (rules.max_size_mb) {
        const maxBytes = rules.max_size_mb * 1024 * 1024;
        const oversized = fileList.some((f: any) => f.size > maxBytes);
        if (oversized) return false;
      }
      return true;
    }, `File size exceeds ${rules.max_size_mb}MB limit`);

    schema = (schema as z.ZodAny).refine((files) => {
      if (!files) return true;
      const fileList = Array.isArray(files) ? files : (files instanceof FileList ? Array.from(files) : [files]);

      // MIME check
      if (rules.allowed_types && rules.allowed_types.length > 0 && !rules.allowed_types.includes('*')) {
        const allowed = rules.allowed_types as string[];
        const invalid = fileList.some((f: any) => {
          const type = f.type;
          const ext = '.' + f.name.split('.').pop().toLowerCase();
          return !allowed.some(a => {
            if (a.endsWith('/*')) return type.startsWith(a.replace('/*', ''));
            if (a.startsWith('.')) return ext === a.toLowerCase();
            return type === a;
          });
        });
        if (invalid) return false;
      }
      return true;
    }, 'Invalid file type');
  }

  return schema;
};

export const generateFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    shape[field.field_key] = generateFieldSchema(field);
  });
  return z.object(shape);
};
