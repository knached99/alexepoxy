<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReplyNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $customer; 
    public $customerMessage;
    public $data; 

    public function __construct(string $customerName, string $customerMessage, array $data)
    {
        $this->customerName = $customerName;
        $this->customerMessage = $customerMessage;
        $this->data = $data;
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
                    ->subject('Alex Epoxy has responded to your contact submission')
                    ->greeting('Hello '.$this->customerName)
                    ->line('Alex Epoxy has responded to your contact submission.')
                    ->line('Here is your original message to Alex Epoxy: ')
                    ->line($this->customerMessage)
                    ->line('And here is their response: ')
                    ->line($this->data['message']);
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
