import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const CheckInDetailView = ({ checkIn, title, description }) => {
  if (!checkIn) {
    return <p className="text-secondary-text-medium">No check-in details to display.</p>;
  }

  const { notes, mood, attachments, timestamp, submittedBy, partnerName, status, submittedAt } = checkIn;
  const displayTimestamp = timestamp || submittedAt;
  const displayName = submittedBy || partnerName;

  return (
    <Card className={cn("shadow-sm border-disabled-text-border-light")}>
      { (title || description) &&
        <CardHeader>
          {title && <CardTitle className="text-lg text-primary-text-dark">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      }
      <CardContent className="text-sm space-y-2 pt-4">
        {displayName && (
          <p><span className="font-semibold text-secondary-text-dark">Submitted by:</span> {displayName}</p>
        )}
        {displayTimestamp && (
          <p><span className="font-semibold text-secondary-text-dark">Date:</span> {new Date(displayTimestamp).toLocaleString()}</p>
        )}
        {status && (
          <p><span className="font-semibold text-secondary-text-dark">Status:</span> 
            <span className={cn(
              "font-bold ml-1",
              status === 'Verified' || status === 'Approved' ? 'text-success-green' :
              status === 'Queried' || status === 'Pending Partner Action' ? 'text-warning-orange' :
              status === 'Pending Verification' ? 'text-info-blue' :
              'text-primary-text-dark'
            )}>
              {status}
            </span>
          </p>
        )}
        {notes && (
          <div>
            <p className="font-semibold text-secondary-text-dark mb-0.5">Notes:</p>
            <p className="whitespace-pre-wrap bg-secondary-beige-extralight p-2 rounded-md border border-disabled-text-border-light">{notes}</p>
          </div>
        )}
        {mood && (
          <p><span className="font-semibold text-secondary-text-dark">Mood:</span> {mood}</p>
        )}
        {attachments && (
          <div>
            <p className="font-semibold text-secondary-text-dark mb-0.5">Attachments:</p>
            {(typeof attachments === 'string' && attachments.trim() !== '') ? (
                attachments.split(',').map((att, index) => {
                    const url = att.trim();
                    // Basic check if it looks like a URL, otherwise just display text
                    const isUrl = url.startsWith('http://') || url.startsWith('https://');
                    const fileName = isUrl ? url.substring(url.lastIndexOf('/') + 1) || url : url;
                    return (
                        <li key={index} className="list-none ml-0">
                        {isUrl ? (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:underline break-all">{fileName}</a>
                        ) : (
                            <span className="text-primary-text-dark">{fileName}</span>
                        )}
                        </li>
                    );
                })
            ) : Array.isArray(attachments) && attachments.length > 0 ? (
                <ul className="list-disc list-inside pl-0 space-y-0.5">
                    {attachments.map((att, index) => (
                    <li key={index}>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary-accent hover:underline break-all">
                        {att.name || 'View Attachment'}
                        </a>
                    </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-xs text-gray-500">No attachments provided.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 