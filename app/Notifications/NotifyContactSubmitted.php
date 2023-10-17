<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyContactSubmitted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $data;
    public $submissionId;
    public function __construct(array $data, $submissionId)
    {
        $this->data = $data;
        $this->submissionId = $submissionId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject($this->data['name'].' Contact You')
                    ->greeting('Hello Alex, '.$this->data['name'].' has contacted you')
                    ->line('Customer Information: ')
                    ->line('Name: '.$this->data['name'])
                    ->line('Email: '.$this->data['email'])
                    ->line('Phone Number: '.$this->data['phone_number'])
                    ->action('View Customer Message', url('getContactSubmission/'.$this->submissionId))
                    ->line('Please respond back to the customer by sending them an reply from the dashboard');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
