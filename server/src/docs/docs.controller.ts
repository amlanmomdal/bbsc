import { Controller, Get, Header } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Public()
@Controller('docs')
export class DocsController {

  private getOpenApiSpec() {
    return {
      openapi: '3.0.0',
      info: {
        title: 'Burul Blue Star Club (BBSC) API Documentation',
        description: 'Interactive OpenAPI / Swagger documentation for BBSC NestJS backend server, Cultural Competitions, & Admin authentication APIs.',
        version: '1.0.0',
        contact: {
          name: 'BBSC Development Team',
          email: 'amlanmondal98@gmail.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:5001',
          description: 'Local Development Server'
        }
      ],
      tags: [
        { name: 'Events & Festivals', description: 'Events & Festivals Management APIs' },
        { name: 'Competitions', description: 'Cultural Competitions Management APIs' },
        { name: 'Gallery Photos', description: 'Gallery Photo Album & Tagged Asset Management APIs' },
        { name: 'Executive Committee', description: 'Executive Committee Member Management APIs' },
        { name: 'Auth', description: 'Admin 4-digit OTP Authentication Endpoints' },
        { name: 'Health', description: 'Server Health Check Endpoint' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter the Admin JWT access token obtained from POST /api/auth/verify-otp'
          }
        }
      },
      paths: {
        '/api/events': {
          get: {
            tags: ['Events & Festivals'],
            summary: 'List all Events & Festivals',
            description: 'Fetches all scheduled events and Pujas stored in MongoDB Atlas. Public endpoint.',
            security: [],
            responses: {
              '200': {
                description: 'List of events returned successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        count: { type: 'number', example: 4 },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: { type: 'string', example: '65f1a2b3c4d5e6f7' },
                              title: { type: 'string', example: 'Grand Kali Puja 2026' },
                              shortTitle: { type: 'string', example: 'Kali Puja' },
                              fullDate: { type: 'string', example: '2026-11-12' },
                              month: { type: 'string', example: 'NOV' },
                              day: { type: 'string', example: '12' },
                              status: { type: 'string', example: 'upcoming' },
                              category: { type: 'string', example: 'Festivals' },
                              location: { type: 'string', example: 'Burul Central Ground' },
                              time: { type: 'string', example: '07:00 PM IST' },
                              description: { type: 'string', example: 'Annual mega Puja festival & cultural show.' },
                              image: { type: 'string', example: '/uploads/events/event-image-1790184000.jpg' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ['Events & Festivals'],
            summary: 'Create New Event / Festival (Direct Image Upload supported)',
            description: 'Creates a new event or Puja entry. Direct image file upload via `image` field supported.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                      title: { type: 'string', example: 'Grand Kali Puja 2026' },
                      shortTitle: { type: 'string', example: 'Kali Puja' },
                      fullDate: { type: 'string', example: '2026-11-12' },
                      category: { type: 'string', example: 'Festivals' },
                      status: { type: 'string', example: 'upcoming' },
                      location: { type: 'string', example: 'Burul Central Ground' },
                      time: { type: 'string', example: '07:00 PM IST' },
                      description: { type: 'string', example: 'Annual mega Puja festival & cultural show.' },
                      image: { type: 'string', format: 'binary', description: 'Event cover image file (PNG, JPG, WEBP)' }
                    }
                  }
                },
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                      title: { type: 'string', example: 'Grand Kali Puja 2026' },
                      shortTitle: { type: 'string', example: 'Kali Puja' },
                      fullDate: { type: 'string', example: '2026-11-12' },
                      category: { type: 'string', example: 'Festivals' },
                      status: { type: 'string', example: 'upcoming' },
                      location: { type: 'string', example: 'Burul Central Ground' },
                      time: { type: 'string', example: '07:00 PM IST' },
                      description: { type: 'string', example: 'Annual mega Puja festival & cultural show.' },
                      image: { type: 'string', example: '/images/kali_puja.jpg' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': { description: 'Event created successfully' },
              '401': { description: 'Unauthorized / Missing JWT Bearer Token' }
            }
          }
        },
        '/api/events/upload': {
          post: {
            tags: ['Events & Festivals'],
            summary: 'Upload Standalone Event Image File (Admin Only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['file'],
                    properties: {
                      file: { type: 'string', format: 'binary', description: 'Event image file to upload' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Image file uploaded successfully' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/events/{id}': {
          get: {
            tags: ['Events & Festivals'],
            summary: 'Get Event / Festival Details by ID',
            security: [],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB Event Document ID' }
            ],
            responses: {
              '200': { description: 'Event details object returned' },
              '404': { description: 'Event not found' }
            }
          },
          put: {
            tags: ['Events & Festivals'],
            summary: 'Update Event / Festival Details (Direct Image Upload supported)',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', example: 'Grand Kali Puja 2026 (Updated)' },
                      shortTitle: { type: 'string', example: 'Kali Puja' },
                      fullDate: { type: 'string', example: '2026-11-12' },
                      description: { type: 'string' },
                      image: { type: 'string', format: 'binary' }
                    }
                  }
                },
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      shortTitle: { type: 'string' },
                      fullDate: { type: 'string' },
                      description: { type: 'string' },
                      image: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Event updated successfully' },
              '404': { description: 'Event not found' }
            }
          },
          delete: {
            tags: ['Events & Festivals'],
            summary: 'Delete Event / Festival (Admin Only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Event and associated image file deleted' },
              '404': { description: 'Event not found' }
            }
          }
        },
        '/api/competitions': {
          get: {
            tags: ['Competitions'],
            summary: 'List all Cultural Competitions',
            description: 'Fetches all cultural competitions stored in MongoDB Atlas database [bbsc]. Public endpoint.',
            security: [],
            responses: {
              '200': {
                description: 'List of competitions returned successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: { type: 'string', example: '65f1a2b3c4d5e6f7' },
                              title: { type: 'string', example: 'Painting Competition' },
                              icon: { type: 'string', example: 'Palette' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ['Competitions'],
            summary: 'Create New Cultural Competition (Direct Image Upload supported)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                      title: { type: 'string', example: 'Painting Competition' },
                      icon: { type: 'string', format: 'binary', description: 'Icon image file (PNG, JPG, SVG, WEBP)' }
                    }
                  }
                },
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['title', 'icon'],
                    properties: {
                      title: { type: 'string', example: 'Painting Competition' },
                      icon: { type: 'string', example: '/uploads/competitions/competition-icon-1741624500000.png' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': { description: 'Competition created successfully in MongoDB Atlas' },
              '401': { description: 'Unauthorized - Invalid or missing Bearer token' }
            }
          }
        },
        '/api/competitions/upload': {
          post: {
            tags: ['Competitions'],
            summary: 'Upload Standalone Icon Image File (Admin Only)',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['file'],
                    properties: {
                      file: {
                        type: 'string',
                        format: 'binary',
                        description: 'Icon image file (PNG, JPG, SVG, WEBP)'
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '201': { description: 'Icon file uploaded successfully to /uploads/competitions/' },
              '401': { description: 'Unauthorized - Invalid or missing Bearer token' }
            }
          }
        },
        '/api/competitions/{id}': {
          get: {
            tags: ['Competitions'],
            summary: 'Get Cultural Competition by ID',
            security: [],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Competition details returned successfully' },
              '404': { description: 'Competition not found' }
            }
          },
          put: {
            tags: ['Competitions'],
            summary: 'Update Cultural Competition (Direct Image Upload supported)',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', example: 'Updated Competition Title' },
                      icon: { type: 'string', format: 'binary', description: 'New icon image file (PNG, JPG, SVG, WEBP)' }
                    }
                  }
                },
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', example: 'Updated Competition Title' },
                      icon: { type: 'string', example: '/uploads/competitions/competition-icon-1741624500000.png' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Competition updated successfully' },
              '401': { description: 'Unauthorized - Invalid or missing Bearer token' }
            }
          },
          delete: {
            tags: ['Competitions'],
            summary: 'Delete Cultural Competition (Admin Only)',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Competition deleted successfully' },
              '401': { description: 'Unauthorized - Invalid or missing Bearer token' }
            }
          }
        },
        '/api/auth/send-otp': {
          post: {
            tags: ['Auth'],
            summary: 'Request 4-Digit OTP for Admin Login',
            security: [],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                      email: { type: 'string', example: 'amlanmondal98@gmail.com' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'OTP dispatched successfully' }
            }
          }
        },
        '/api/auth/verify-otp': {
          post: {
            tags: ['Auth'],
            summary: 'Verify 4-Digit OTP Code (Returns Bearer accessToken)',
            security: [],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email', 'otp'],
                    properties: {
                      email: { type: 'string', example: 'amlanmondal98@gmail.com' },
                      otp: { type: 'string', example: '4829' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'OTP verified successfully and returns Bearer accessToken' }
            }
          }
        },
        '/api/auth/me': {
          get: {
            tags: ['Auth'],
            summary: 'Get Current Admin Profile',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'email', in: 'query', required: false, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Admin profile data' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/gallery': {
          get: {
            tags: ['Gallery Photos'],
            summary: 'List all Gallery Photos',
            description: 'Fetches all gallery photos stored in MongoDB Atlas with optional Tag / Category filter. Public endpoint.',
            security: [],
            parameters: [
              { name: 'category', in: 'query', required: false, schema: { type: 'string', example: 'Kali Puja' }, description: 'Filter photos by Tag/Category (e.g. Kali Puja, Saraswati Puja, Events, Competitions, Social Work)' },
              { name: 'tag', in: 'query', required: false, schema: { type: 'string', example: 'Events' }, description: 'Alias for category parameter' }
            ],
            responses: {
              '200': {
                description: 'List of gallery photos returned successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        count: { type: 'number', example: 3 },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: { type: 'string', example: '65f1a9b8c7d6e5f4' },
                              title: { type: 'string', example: 'Grand Mandap Illumination 2024' },
                              category: { type: 'string', example: 'Kali Puja' },
                              shortDescription: { type: 'string', example: 'Spectacular LED lighting and mandap art.' },
                              image: { type: 'string', example: '/uploads/gallery/gallery-image-1790200000.jpg' },
                              date: { type: 'string', example: '2024-11-12' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ['Gallery Photos'],
            summary: 'Add New Gallery Photo (Direct File Upload supported)',
            description: 'Creates a new gallery item with Tag, Title, Short Description, Date, and optional direct image upload.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                      title: { type: 'string', example: 'Grand Mandap Illumination 2024' },
                      category: { type: 'string', example: 'Kali Puja', description: 'Tag / Category name' },
                      shortDescription: { type: 'string', example: 'Spectacular LED lighting and mandap art.' },
                      date: { type: 'string', example: '2024-11-12' },
                      image: { type: 'string', format: 'binary', description: 'Photo image file to upload' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': { description: 'Gallery photo published successfully' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/gallery/upload': {
          post: {
            tags: ['Gallery Photos'],
            summary: 'Upload Standalone Gallery Image File',
            description: 'Uploads a single image file to `/uploads/gallery/` and returns the file URL.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['file'],
                    properties: {
                      file: { type: 'string', format: 'binary', description: 'Image file to upload' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Image file uploaded successfully' },
              '400': { description: 'Bad Request - Invalid file type' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/gallery/{id}': {
          get: {
            tags: ['Gallery Photos'],
            summary: 'Get Gallery Photo Details by ID',
            security: [],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Gallery item details' },
              '444': { description: 'Not found' }
            }
          },
          put: {
            tags: ['Gallery Photos'],
            summary: 'Update Gallery Photo Details & Replace Image File',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', example: 'Updated Mandap Illumination 2024' },
                      category: { type: 'string', example: 'Kali Puja' },
                      shortDescription: { type: 'string', example: 'Updated short description.' },
                      date: { type: 'string', example: '2024-11-12' },
                      image: { type: 'string', format: 'binary', description: 'New photo image file to replace old image' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Gallery photo updated successfully' },
              '401': { description: 'Unauthorized' }
            }
          },
          delete: {
            tags: ['Gallery Photos'],
            summary: 'Delete Gallery Photo & Unlink Disk Asset',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Gallery photo deleted & file unlinked' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/committee': {
          get: {
            tags: ['Executive Committee'],
            summary: 'List all Executive Committee Members',
            description: 'Fetches all executive committee members stored in MongoDB Atlas. Public endpoint.',
            security: [],
            responses: {
              '200': {
                description: 'List of committee members returned successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        count: { type: 'number', example: 4 },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              _id: { type: 'string', example: '65f1a9b8c7d6e5f4' },
                              name: { type: 'string', example: 'Rintu Das' },
                              role: { type: 'string', example: 'President' },
                              photo: { type: 'string', example: '/uploads/committee/committee-photo-1790300000.jpg' },
                              contact: { type: 'string', example: '+91 9876543210' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ['Executive Committee'],
            summary: 'Add New Executive Committee Member (Direct Photo Upload supported)',
            description: 'Creates a new executive member record with Name, Position / Role, Photo, and Contact details.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['name', 'role'],
                    properties: {
                      name: { type: 'string', example: 'Rintu Das' },
                      position: { type: 'string', example: 'President', description: 'Position / Role title' },
                      role: { type: 'string', example: 'President' },
                      contact: { type: 'string', example: '+91 9876543210' },
                      photo: { type: 'string', format: 'binary', description: 'Member photo file to upload' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': { description: 'Committee member added successfully' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/committee/upload': {
          post: {
            tags: ['Executive Committee'],
            summary: 'Upload Standalone Committee Member Photo File',
            description: 'Uploads a single photo file to `/uploads/committee/` and returns the file URL.',
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['file'],
                    properties: {
                      file: { type: 'string', format: 'binary', description: 'Photo file to upload' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Photo file uploaded successfully' },
              '400': { description: 'Bad Request - Invalid file type' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/committee/{id}': {
          get: {
            tags: ['Executive Committee'],
            summary: 'Get Committee Member Details by ID',
            security: [],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Member details' },
              '444': { description: 'Not found' }
            }
          },
          put: {
            tags: ['Executive Committee'],
            summary: 'Update Committee Member Details & Replace Photo File',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
              required: true,
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Rintu Das' },
                      position: { type: 'string', example: 'President' },
                      role: { type: 'string', example: 'President' },
                      contact: { type: 'string', example: '+91 9876543210' },
                      photo: { type: 'string', format: 'binary', description: 'New photo file to replace old photo' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Committee member updated successfully' },
              '401': { description: 'Unauthorized' }
            }
          },
          delete: {
            tags: ['Executive Committee'],
            summary: 'Delete Committee Member & Unlink Photo Asset',
            security: [{ bearerAuth: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: {
              '200': { description: 'Committee member deleted & photo unlinked' },
              '401': { description: 'Unauthorized' }
            }
          }
        },
        '/api/health': {
          get: {
            tags: ['Health'],
            summary: 'Check API Server Health Status',
            security: [],
            responses: {
              '200': { description: 'Server online' }
            }
          }
        }
      }
    };
  }

  @Get('json')
  getOpenApiJson() {
    return this.getOpenApiSpec();
  }

  @Get()
  @Header('Content-Type', 'text/html')
  getSwaggerUiHtml(): string {
    const specJson = JSON.stringify(this.getOpenApiSpec());
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>BBSC API Documentation | Swagger UI</title>
        <link rel="icon" type="image/png" href="/images/bbsc_official_logo.png" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #fafafa; font-family: sans-serif; }
          .swagger-ui .topbar { background-color: #1e3a8a; border-bottom: 3px solid #f59e0b; padding: 10px 0; }
          .topbar-wrapper img { content: url('/images/bbsc_official_logo.png'); height: 42px; width: auto; }
          .swagger-ui .info { margin: 30px 0; }
          .swagger-ui .info .title { color: #1e3a8a; font-weight: 800; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              spec: ${specJson},
              dom_id: '#swagger-ui',
              deepLinking: true,
              persistAuthorization: true,
              displayRequestDuration: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "BaseLayout"
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `;
  }
}
